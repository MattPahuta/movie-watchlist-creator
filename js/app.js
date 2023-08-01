// api key: 9da4b049
/* OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=9da4b049
  http://www.omdbapi.com/?apikey=[yourkey]&
  http://www.omdbapi.com/?t=batman
*/

// *** ToDo: create api object with key, url endpoints?
// const apiKey = '9da4b049';
const baseUrl = `http://www.omdbapi.com/?apikey=9da4b049`;
// Current Search Results
const searchResults = []; // array for detailed result items

// initialize watchlist array - local storage or new empty array
// v 1.0
// let localStorageWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || []; 


// Listen for events on search form
// *** ToDo: Add all listeners to init() function???

function initHome() {
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('search-input')
    searchByTerm(searchInput.value.trim()); // trim input value for uniformity
    searchInput.value = '';
  });
}

// Listen for clicks on add/remove from watchlist buttons
document.addEventListener('click', e => {

  const filmID = e.target.dataset.film; // unique film ID

  if (e.target.classList.contains('card-add-btn')) {
    saveToWatchlist(filmID); // save film to watchlist
  }

  if (e.target.classList.contains('card-remove-btn')) {
    const filmCard = e.target.closest('.card'); // get button's parent card
    removeFilm(filmCard, filmID); // remove film from DOM and LS
  }
})

// Get the watchlist from local storage - v 2.0
function getWatchlistFromStorage() {
  let watchlistArray;

  // *** ToDo: Try making this a ternary
  if (!localStorage.getItem('myWatchlist')) {
    watchlistArray = [];
  } else {
    watchlistArray = JSON.parse(localStorage.getItem('myWatchlist'));
  }
  return watchlistArray;
}


// Search OMDB by search term
async function searchByTerm(searchTerm) {
  searchResults.length = 0; // clear previous search results

  if (!searchTerm) { // ensure a valid string was passed in
    alert('Enter a search term!');
    return;
  }
  const res = await fetch(`${baseUrl}&s=${searchTerm}`)
  const data = await res.json();

  // get detailed results for each result
  for (let film of data.Search) {
    const res = await fetch(`${baseUrl}&i=${film.imdbID}`); // fetch detailed info for each ID
    const data = await res.json();
    searchResults.push(data)
  }

  console.log('Search Results: ', searchResults)
  renderFilmCards(searchResults);
}

// Save film to local storage watchlist
function saveToWatchlist(filmToSave) { // filmToSave = imdbID
  // match clicked imdbID with matching film in search results
  const filmObject = searchResults.filter(film => film.imdbID === filmToSave)[0];
  const watchlist = getWatchlistFromStorage(); // get current watchlist from LS

  // check if film is already in the ls watchlist
  for (let film of watchlist) { // ***ToDo: make this forEach
    if (film.imdbID === filmObject.imdbID) {
      console.log('Aleady added to watchlist!')
      return;
    }
  }

  watchlist.push(filmObject); // add selected film to watchlist
  localStorage.setItem('myWatchlist', JSON.stringify(watchlist)); // set updated LS watchlist

}

// Remove film from watchlist page
function removeFilm(filmCard, filmID) {
  // if (confirm('you sure?')) {
  //   filmCard.remove();
  //   removeFilmFromStorage(filmID); 
  // }
  // *** ToDo: Add a confirmation modal?
  filmCard.remove(); // remove film's HTML card from DOM
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
  const resultsGrid = document.getElementById('results-grid');
  while (resultsGrid.firstChild) { // clear existing results content with while loop
    resultsGrid.removeChild(resultsGrid.firstChild);
  }  

  filmData.forEach(result => {
    const { Poster, Title, imdbID, imdbRating, Runtime, Genre, Plot } = result;

    // build result card
    const card = document.createElement('div');
    card.classList.add('card');

    // ToDo: Handle props with 'N/A' - placeholder div for posters ('poster not available'), etc.

    card.innerHTML = `
      <a href="https://www.imdb.com/title/${imdbID}" target="_blank"><img src="${Poster}" alt="${Title} poster" class="card-img"></a>
      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${Title}</h3>
          <p class="rating"><i class="fa-solid fa-star"></i><span>${imdbRating}</span></p>
        </div>
        <div class="card-meta">
          <span class="card-runtime">${Runtime}</span>
          <span class="card-genre">${Genre}</span>
        </div>
        <button data-film="${imdbID}" class="btn ${watchlistPage ? 'card-remove-btn' : 'card-add-btn'}">
          <i class="fa-solid ${watchlistPage ? 'fa-circle-minus' : 'fa-circle-plus'}"></i> Watchlist
        </button>
        <p class="card-body">${Plot}</p>
      </div>
      `
    resultsGrid.appendChild(card)
  });


}

// Router function
function initializePage() {
  switch (document.body.id) {
    case 'home':
      initHome();
      break;
    case 'watchlist':
      renderFilmCards(getWatchlistFromStorage(), true);
      break;
  }  
}

initializePage();

function showLoader() {
  document.getElementById('loader').display = 'grid';
}

function hideLoader() {
  document.getElementById('loader').display = 'none';
}