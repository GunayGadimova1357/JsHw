require('dotenv').config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "change_me";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

if (!OPENWEATHER_API_KEY) {
  console.warn("⚠️ OPENWEATHER_API_KEY not set. Weather API calls will fail. Please set it in .env file.");
}

const USERS_PATH = path.join(__dirname, "data", "users.json");

let writeLock = Promise.resolve();

async function readUsers() {
  const raw = await fs.readFile(USERS_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeUsers(users) {
  writeLock = writeLock.then(() =>
    fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf-8")
  );
  return writeLock;
}

function requireAuth(req, res, next) {
  if (!req.session?.userId) return res.status(401).json({ error: "Unauthorized" });
  next();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || password.length < 6) {
      return res.status(400).json({ error: "Username is required, password must be at least 6 characters." });
    }

    const users = await readUsers();
    const exists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
    if (exists) return res.status(409).json({ error: "User already exists." });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: cryptoRandomId(),
      username,
      passwordHash,
      home: null, 
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);

    req.session.userId = newUser.id;
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await readUsers();
    const user = users.find((u) => u.username.toLowerCase() === String(username).toLowerCase());
    if (!user) return res.status(401).json({ error: "Invalid username or password." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid username or password." });

    req.session.userId = user.id;
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get("/api/me", requireAuth, async (req, res) => {
  const users = await readUsers();
  const user = users.find((u) => u.id === req.session.userId);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  res.json({
    id: user.id,
    username: user.username,
    home: user.home,
  });
});

app.post("/api/profile/home", requireAuth, async (req, res) => {
  try {
    const { lat, lon, address } = req.body;
    if (typeof lat !== "number" || typeof lon !== "number") {
      return res.status(400).json({ error: "lat/lon must be numbers." });
    }

    const users = await readUsers();
    const idx = users.findIndex((u) => u.id === req.session.userId);
    if (idx === -1) return res.status(401).json({ error: "Unauthorized" });

    users[idx].home = {
      lat,
      lon,
      address: address || null,
      updatedAt: new Date().toISOString(),
    };

    await writeUsers(users);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/weather/nearby", requireAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const perPage = 5;

    const users = await readUsers();
    const user = users.find((u) => u.id === req.session.userId);
    if (!user?.home) {
      return res.status(400).json({ error: "Please set your home address in profile first." });
    }
    if (!OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: "OPENWEATHER_API_KEY is not configured on the server." });
    }

    const { lat, lon } = user.home;

    // 1) получить ближайшие города (в радиусе ~100км)
    // В OpenWeather /find использует cnt (количество) и "cluster=yes", "radius" в км.
    // Берем побольше, потом режем на страницы.
    const findUrl = new URL("https://api.openweathermap.org/data/2.5/find");
    findUrl.searchParams.set("lat", String(lat));
    findUrl.searchParams.set("lon", String(lon));
    findUrl.searchParams.set("cnt", "50");
    findUrl.searchParams.set("units", "metric");
    findUrl.searchParams.set("lang", "en");
    findUrl.searchParams.set("appid", OPENWEATHER_API_KEY);

    // radius=100 можно добавить, но OpenWeather иногда по-разному трактует;
    // чаще достаточно списка + фильтра по расстоянию на сервере.
    // findUrl.searchParams.set("radius", "100");

    const findResp = await fetch(findUrl);
    if (!findResp.ok) return res.status(502).json({ error: "Error fetching from OpenWeather (find)" });
    const findData = await findResp.json();

    const rawCities = Array.isArray(findData.list) ? findData.list : [];

    // Фильтруем точно по расстоянию <= 100 км (Haversine)
    const cities100 = rawCities
      .map((c) => ({
        id: c.id,
        name: c.name,
        coord: c.coord,
      }))
      .filter((c) => c.coord?.lat && c.coord?.lon)
      .map((c) => ({
        ...c,
        distanceKm: haversineKm(lat, lon, c.coord.lat, c.coord.lon),
      }))
      .filter((c) => c.distanceKm <= 100)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const total = cities100.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * perPage;
    const slice = cities100.slice(start, start + perPage);

    // 2) для каждого города берём "нормальную" текущую погоду
    const weatherItems = await Promise.all(
      slice.map(async (c) => {
        const wUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
        wUrl.searchParams.set("id", String(c.id));
        wUrl.searchParams.set("units", "metric");
        wUrl.searchParams.set("lang", "en");
        wUrl.searchParams.set("appid", OPENWEATHER_API_KEY);

        const wResp = await fetch(wUrl);
        if (!wResp.ok) return { city: c, error: "Weather fetch failed" };
        const w = await wResp.json();

        return {
          city: c,
          weather: {
            description: w.weather?.[0]?.description ?? null,
            icon: w.weather?.[0]?.icon ?? null,
            temp: w.main?.temp ?? null,
            feelsLike: w.main?.feels_like ?? null,
            humidity: w.main?.humidity ?? null,
            pressure: w.main?.pressure ?? null,
            windSpeed: w.wind?.speed ?? null,
            windDeg: w.wind?.deg ?? null,
            clouds: w.clouds?.all ?? null,
            visibility: w.visibility ?? null,
            rain1h: w.rain?.["1h"] ?? null,
            snow1h: w.snow?.["1h"] ?? null,
            updatedAt: w.dt ? new Date(w.dt * 1000).toISOString() : null,
          },
        };
      })
    );

    res.json({
      page: safePage,
      perPage,
      total,
      totalPages,
      home: user.home,
      items: weatherItems,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// -------- utils --------
function cryptoRandomId() {
  // без внешних либ
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
