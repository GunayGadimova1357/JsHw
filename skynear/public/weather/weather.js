let page = 1;

async function loadWeather() {
  const res = await fetch(`/api/weather/nearby?page=${page}`);
  const data = await res.json();

  const container = document.getElementById("weatherContainer");
  container.innerHTML = "";

  if (!data.items) {
    container.innerHTML = "<p style='color:white;text-align:center;'>No weather data available.</p>";
    return;
  }

  data.items.forEach(item => {
    const w = item.weather;

    container.innerHTML += `
      <div class="weather-card">
        <div class="city-name">${item.city.name}</div>
        <div class="temp">${w.temp}°C</div>
        <div class="details">
          ${w.description}<br>
          Feels like: ${w.feelsLike}°C<br>
          Humidity: ${w.humidity}%<br>
          Wind: ${w.windSpeed} m/s<br>
          Pressure: ${w.pressure} hPa
        </div>
      </div>
    `;
  });
}

document.getElementById("prev").addEventListener("click", () => {
  if (page > 1) {
    page--;
    loadWeather();
  }
});

document.getElementById("next").addEventListener("click", () => {
  page++;
  loadWeather();
});

loadWeather();
