interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
}

interface NewsApiResponse {
  status?: string;
  message?: string;
  articles?: Article[];
}

let currentPage = 1;
let currentCategory = "technology";
const pageSize = 6;

const newsContainer = document.getElementById("news") as HTMLDivElement;
const loader = document.getElementById("loader") as HTMLDivElement;
const pageSpan = document.getElementById("page") as HTMLSpanElement;
const statusEl = document.getElementById("status") as HTMLDivElement;
const prevBtn = document.getElementById("prev") as HTMLButtonElement;
const nextBtn = document.getElementById("next") as HTMLButtonElement;

function setStatus(message: string, isError = false): void {
  statusEl.textContent = message;
  statusEl.classList.toggle("status-error", isError);
}

async function fetchNews(): Promise<void> {
  loader.style.display = "block";
  newsContainer.innerHTML = "";
  setStatus("Loading news...");

  try {
    const response = await fetch(
      `/api/news?category=${encodeURIComponent(currentCategory)}&page=${currentPage}&pageSize=${pageSize}`
    );

    const data: NewsApiResponse = await response.json();

    if (!response.ok || data.status === "error") {
      throw new Error(data.message || "Unable to fetch news");
    }

    if (!data.articles || data.articles.length === 0) {
      setStatus("No news found for this category.");
      pageSpan.textContent = String(currentPage);
      prevBtn.disabled = currentPage === 1;
      return;
    }

    renderNews(data.articles);
    pageSpan.textContent = String(currentPage);
    prevBtn.disabled = currentPage === 1;
    setStatus(`Showing ${data.articles.length} articles`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Loading error";
    setStatus(message, true);
    newsContainer.innerHTML = "";
  } finally {
    loader.style.display = "none";
  }
}

function renderNews(articles: Article[]): void {
  newsContainer.innerHTML = "";

  articles.forEach((article, index) => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.style.animationDelay = `${index * 0.08}s`;

    card.innerHTML = `
      <div class="news-media">
        ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" loading="lazy" />` : '<div class="news-image-fallback">No image</div>'}
      </div>
      <div class="news-content">
        <h3><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h3>
        <p>${article.description ?? "Description is not available."}</p>
        <small>${new Date(article.publishedAt).toLocaleString()}</small>
      </div>
    `;

    newsContainer.appendChild(card);
  });
}

document.getElementById("category")!.addEventListener("change", (event) => {
  currentCategory = (event.target as HTMLSelectElement).value;
  currentPage = 1;
  fetchNews();
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    fetchNews();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage += 1;
  fetchNews();
});

fetchNews();
