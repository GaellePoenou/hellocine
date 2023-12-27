// Ajoutez ces variables globales en haut de votre fichier JavaScript
const resultsPerPage = 5; // Nombre de résultats par page
let currentPage = 1; // Page actuelle
let currentResults = []; // Résultats de la page actuelle
let currentQuery = ""; // Requête de recherche actuelle
let currentGenre = ""; // Genre de filtrage actuel
let currentYear = ""; // Année de filtrage actuelle

// Fonction pour effectuer la recherche de films
function searchMovies(query, page = 1) {
  const apiKey = "69958127ce050989bedd92233c690dae"; // Remplacez par votre propre clé d'API TMDb
  const language = "fr-FR"; // Spécifiez la langue (français)
  let apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=${language}&page=${page}`;

  if (currentGenre) {
    apiUrl += `&with_genres=${currentGenre}`;
  }

  if (currentYear) {
    apiUrl += `&year=${currentYear}`;
  }

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      currentQuery = query; // Met à jour la requête actuelle
      currentGenre = ""; // Réinitialise le genre actuel
      currentYear = ""; // Réinitialise l'année actuelle
      displayResults(data.results);
      displayPagination(data.total_results);
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la recherche de films:",
        error
      );
    });
}

// Fonction pour afficher les résultats de la recherche
function displayResults(results) {
  const resultsContainer = document.querySelector(".results-container");
  resultsContainer.innerHTML = "";

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>Aucun résultat trouvé.</p>";
    return;
  }

  results.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <h2>${movie.title}</h2>
      <p>Année de sortie : ${movie.release_date}</p>
      <p>Note : ${movie.vote_average}</p>
      <p>${movie.overview}</p>
    `;
    resultsContainer.appendChild(movieCard);
  });
}

// Fonction pour afficher la pagination
function displayPagination(totalResults) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      searchMovies(currentQuery, currentPage);
    });
    paginationContainer.appendChild(pageButton);
  }

  const currentResultsContainer = document.getElementById("current-results");
  currentResultsContainer.textContent = `Page ${currentPage} sur ${totalPages}`;
}

// Événement de clic sur le bouton de recherche
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", () => {
  const searchInput = document.getElementById("search-input");
  const query = searchInput.value.trim();

  if (query !== "") {
    searchMovies(query);
  }
});

// Événement de pression sur la touche "Entrée" dans le champ de recherche
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();

    if (query !== "") {
      searchMovies(query);
    }
  }
});

// Événement de clic sur le bouton de filtrage
const filterButton = document.getElementById("filter-button");
filterButton.addEventListener("click", () => {
  const searchInput = document.getElementById("search-input");
  const query = searchInput.value.trim();
  const genreSelect = document.getElementById("genre-select");
  const selectedGenre = genreSelect.value;
  const yearSelect = document.getElementById("year-select");
  const selectedYear = yearSelect.value;

  if (query !== "") {
    currentGenre = selectedGenre;
    currentYear = selectedYear;
    searchMovies(query);
  }
});
