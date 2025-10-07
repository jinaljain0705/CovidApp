const GLOBAL_API_URL = "https://disease.sh/v3/covid-19/all";
const COUNTRIES_API_URL = "https://disease.sh/v3/covid-19/countries";

const globalStatsEl = document.getElementById("global-stats");
const countryListEl = document.getElementById("country-list");
const lastUpdatedEl = document.getElementById("last-updated");
const searchInput = document.getElementById("search-input");
const errorEl = document.getElementById("error-message");

let allCountries = [];

// Fetch data 
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Network error");
  return response.json();
}

// Render global stats
function renderGlobalStats(data) {
  lastUpdatedEl.textContent =
    "Last Updated: " + new Date(data.updated).toLocaleString();

  const stats = [
    {
      title: "Total Cases",
      value: data.cases,
      color: "text-blue-400",
      icon: "🦠",
    },
    {
      title: "Total Deaths",
      value: data.deaths,
      color: "text-red-400",
      icon: "💀",
    },
    {
      title: "Recovered",
      value: data.recovered,
      color: "text-green-400",
      icon: "💚",
    },
    {
      title: "Active",
      value: data.active,
      color: "text-yellow-400",
      icon: "⚡",
    },
  ];

  globalStatsEl.innerHTML = stats
    .map(
      (s) => `
          <div class="bg-gray-800 p-4 rounded-lg shadow-lg border-t-4 border-indigo-500/50">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-300 font-medium">${s.title}</span>
              <span class="${s.color} text-xl">${s.icon}</span>
            </div>
            <div class="text-2xl font-bold">${s.value.toLocaleString()}</div>
          </div>
        `
    )
    .join("");
}

// Render countries
function renderCountries(countries) {
  if (countries.length === 0) {
    countryListEl.innerHTML = `<div class="col-span-full text-center text-gray-400 py-6">No countries found.</div>`;
    return;
  }

  countryListEl.innerHTML = countries
    .map(
      (c) => `
          <div class="bg-gray-800 p-4 rounded-lg hover:scale-[1.02] transform transition">
            <div class="flex items-center mb-3">
              <img src="${
                c.countryInfo.flag
              }" class="w-8 h-6 rounded mr-2 border border-gray-600" />
              <h3 class="text-xl font-bold">${c.country}</h3>
            </div>
            <p class="text-blue-400">🦠 Cases: ${c.cases.toLocaleString()}</p>
            <p class="text-red-400">💀 Deaths: ${c.deaths.toLocaleString()}</p>
            <p class="text-green-400">💚 Recovered: ${c.recovered.toLocaleString()}</p>
            <p class="text-yellow-400">⚡ Active: ${c.active.toLocaleString()}</p>
          </div>
        `
    )
    .join("");
}

// Search filter
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = allCountries.filter((c) =>
    c.country.toLowerCase().includes(query)
  );
  renderCountries(filtered);
}

searchInput.addEventListener("input", handleSearch);

async function init() {
  try {
    const [globalData, countriesData] = await Promise.all([
      fetchData(GLOBAL_API_URL),
      fetchData(COUNTRIES_API_URL),
    ]);
    allCountries = countriesData;
    renderGlobalStats(globalData);
    renderCountries(allCountries);
  } catch (err) {
    console.error(err);
    errorEl.classList.remove("hidden");
  }
}

init();
