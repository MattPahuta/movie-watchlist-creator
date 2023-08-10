/* OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=9da4b049
  http://www.omdbapi.com/?apikey=[yourkey]&
  http://www.omdbapi.com/?t=batman
*/

// *** ToDo: break api key and base url into seperate variables, make uppercase consts
const OMDB_API_KEY = '9da4b049';
const BASE_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

let tempSearchResults = [];

const resultsGrid = document.getElementById('results-grid');
const loadingWrapper = document.querySelector('.loading-wrapper');
const loader = document.getElementById('loader');

// Event Handling 2.0
document.addEventListener('click', handleClickEvents);

// Handle various events
function handleClickEvents(e) {
  // search events
  if (e.target.id === 'search-btn') {
    handleSearch(e);
  }

  const filmID = e.target.dataset.film; // unique film ID
  // add film to watchlist listener
  if (e.target.classList.contains('card-add-btn')) {
    saveToWatchlist(filmID); // save film to watchlist
  }
  // remove film from watchlist listener
  if (e.target.classList.contains('card-remove-btn')) {
    const filmCard = e.target.closest('.card'); // get button's parent card
    removeFilm(filmCard, filmID); // remove film from DOM and LS
  }
}

// Get the watchlist from local storage
function getWatchlistFromStorage() {
  let watchlistArray; // initialize array for the LS watchlist

  localStorage.getItem('myWatchlist') // check for a watchlist in LS
    ? watchlistArray = JSON.parse(localStorage.getItem('myWatchlist'))
    : watchlistArray = []

  return watchlistArray; // returns LS array or empty array
}

// clear all children from results grid - search and watchlist pages
function clearResultsGrid() {
  while (resultsGrid.firstChild) { // clear existing results content with while loop
    resultsGrid.removeChild(resultsGrid.firstChild);
  } 
}

// Search OMDB by search term - v1.0
// *** ToDo: implement parallel fetch request 
// async function searchByTerm(searchTerm) {
//   searchResults.length = 0; // clear previous search results

//   if (!searchTerm) { // ensure a valid string was passed in
//     alert('Enter a search term!');
//     return;
//   }
//   try {
//     clearResultsGrid(); // clear previous results
//     errorToggle(); // toggle error message
//     showLoader(); // show the loader
//     const res = await fetch(`${baseUrl}&s=${searchTerm}`)
//     const data = await res.json();
//     // get detailed results for each result
//     for (let film of data.Search) {
//       const res = await fetch(`${baseUrl}&i=${film.imdbID}`); // fetch detailed info for each ID
//       const data = await res.json();
//       searchResults.push(data);
//     }
//     renderFilmCards(searchResults); // render the result cards
//     checkForSavedFilms(); // check for films already in watchlist
//     hideLoader(); // hide loader
//   } catch(err) {
//     hideLoader(); // hide the loader
//     errorToggle(err); // show the error
//   }
// }

async function handleSearch(e) {
  e.preventDefault();
  const searchInput = document.getElementById('search-input'); 
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) { // ensure a valid string was passed in
    alert('Enter a search term!');
    return;
  }

  try {
    searchInput.value = '';
    clearResultsGrid();
    errorToggle();
    showLoader();
    // fetch search results:
    const data = await fetchOMDBData(`${BASE_URL}&s=${searchTerm}`);
    const searchResults = await Promise.all(data.Search
      .map(film => fetchOMDBData(`${BASE_URL}&i=${film.imdbID}`)));

    tempSearchResults = [...searchResults]; // ToDo: find a better way to do this?
    renderFilmCards(searchResults);
    checkForSavedFilms(searchResults);
    hideLoader();
  } catch (error) {
    hideLoader();
    errorToggle();
  }
}

// async search utility function
async function fetchOMDBData(url) {
  const res = await fetch(url);
  return res.json();
}

// Handle error message display
function errorToggle(err = false) {
  const errorDialog = document.getElementById('error-dialog');
  err 
    ? errorDialog.style.display = 'block' 
    : errorDialog.style.display = 'none';
}

// Check search results for films already saved to WL, mark as such
function checkForSavedFilms() {
  const watchlist = getWatchlistFromStorage(); // get the watchlist

  const savedTagHtml = `
    <p class="saved-film">
      <i class="fa-solid fa-circle-check"></i> Film Saved
    </p>`
  // loop over searchResults to match films saved in watchlist
  for (let film of tempSearchResults) {
    for (let savedFilm of watchlist) { // loop over watchlist for each film
      if (film.imdbID === savedFilm.imdbID) { // compare imdbID
        document.querySelector(`[data-btn-container="${savedFilm.imdbID}"]`).innerHTML = savedTagHtml;
      }
    }
  }
}

// Save film to local storage watchlist
function saveToWatchlist(filmToSave) { // filmToSave = imdbID
  // match clicked imdbID with matching film in search results
  const filmObject = tempSearchResults.filter(film => film.imdbID === filmToSave)[0];



  const watchlist = getWatchlistFromStorage(); // get current watchlist from LS
  watchlist.push(filmObject); // add selected film to watchlist
  localStorage.setItem('myWatchlist', JSON.stringify(watchlist)); // set updated LS watchlist
  checkForSavedFilms(); // check for films already saved
  updateCounter(); // update watchlist counter
}

// Get count of film in watchlist
function updateCounter() {
  const counter = document.getElementById('counter');
  const watchlistLength = getWatchlistFromStorage().length;
  watchlistLength 
    ? counter.textContent = `(${watchlistLength})`
    : counter.textContent = '';
}

// Remove film from watchlist page
function removeFilm(filmCard, filmID) {
  filmCard.remove(); // remove film card html from DOM
  removeFilmFromStorage(filmID); // remove film from LS
}

// Remove film from local storage
function removeFilmFromStorage(filmID) {
  let watchlist = getWatchlistFromStorage(); // get current watchlist from LS
  watchlist = watchlist.filter(filmObj => filmObj.imdbID !== filmID); // filter out filmID
  localStorage.setItem('myWatchlist', JSON.stringify(watchlist)); // update watchlist in LS
}

// Render results to the DOM
// watchlist boolean value to determine style of card button to apply (add or remove)
function renderFilmCards(filmData, watchlistPage = false) { 
  clearResultsGrid(); // clear any previous results
  // loop through film data passed in
  filmData.forEach(result => {
    const { Poster, Title, imdbID, imdbRating, Runtime, Genre, Plot } = result;

    // build result card
    const card = document.createElement('div');
    card.classList.add('card');
    // placeholder for films without images
    const noImg = `https://placehold.co/300x444/fec552/1c1c1c?text=No+Image+Available`;

    const btnHtml = watchlistPage
      ? `<button data-film="${imdbID}" class="btn card-remove-btn">
          <i class="fa-solid fa-circle-minus"></i> Remove
         </button>`
      : `<button data-film="${imdbID}" class="btn card-add-btn">
          <i class="fa-solid fa-circle-plus"></i> Watchlist
         </button>`

    card.innerHTML = `
      <a href="https://www.imdb.com/title/${imdbID}" target="_blank">
        <img src="${Poster === 'N/A' ? noImg : Poster}" alt="${Title} poster" class="card-img">
      </a>
      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${Title}</h3>
          <p class="rating"><i class="fa-solid fa-star"></i><span>${imdbRating}</span></p>
        </div>
        <div class="card-meta">
          <span class="card-runtime">${Runtime}</span>
          <span class="card-genre">${Genre}</span>
        </div>
          <div class="btn-container" data-btn-container="${imdbID}">
          ${btnHtml}
          </div>
        <p class="card-body">${Plot}</p>
      </div>
      `
    resultsGrid.appendChild(card);
  });
}

// Router function
function initializePage() {
  switch (document.body.id) {
    case 'home':
      updateCounter();
      // console.log('Welcome to the Party, pal');
      break;
    case 'watchlist':
      if (getWatchlistFromStorage().length) {
        renderFilmCards(getWatchlistFromStorage(), true);
        break;
      }
  }  
}

// show loader
// *** ToDo: refactor loader/loadingWrapper styles
// place inside the resultsGrid? Make resultsGrid 100% height? 
function showLoader() {
  loadingWrapper.style.display = 'grid';
  loader.style.display = 'grid';
}
// hide loader
function hideLoader() {
  loadingWrapper.style.display = 'none';
  loader.style.display = 'none';
}

initializePage();