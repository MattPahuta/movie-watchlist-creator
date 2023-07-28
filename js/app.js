// api key: 9da4b049
/* OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=9da4b049
  http://www.omdbapi.com/?apikey=[yourkey]&
  http://www.omdbapi.com/?t=batman
*/



// global document event listener 
// ToDo: Make this an init/event function, call on page load? 
// *** Reviewer question: Thoughts on how to implement multiple handlers on a page?
document.addEventListener('click', e => {
  // if Search button is clicked
  if (e.target.id === 'search-btn') {
    const searchInput = document.getElementById('search-input');
    console.log('Searching the OMDB...')
    searchByTitle();
    searchInput.value = '';
  }

  // if 'add to watchlist btn' clicked - remove 'addEventHandlers' function 
  if (e.target.classList.contains('card-btn')) {
    const filmToSave = e.target.dataset.film; // imdbID as unique data attribute
    // console.log(e.target)
    saveToWatchlist(filmToSave); // call saveToWatchlist, passing in imdbID
  }


})



// make request to omdb api for movie titles
async function searchByTitle() {
  const apiKey = '9da4b049'; // move out of the function?

  // const searchTerm = searchInput.value;
  const searchTerm = document.getElementById('search-input').value;
  const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`)
  const data = await res.json();

  const searchResults = [] // use map for this ?
  for (let movie of data.Search) { // use map for this?
    const res = await fetch(`http://www.omdbapi.com/?apikey=9da4b049&i=${movie.imdbID}`);
    const data = await res.json();
    searchResults.push(data)
  }

  render(searchResults)
}





// save selected movies to localStorage
function saveToWatchlist(filmToSave) {

  // ToDo: check if film is already in the watchlist
  //  if so, display message (alert for dev, modal (html?) for prod)
  //  if not, save filmToSave (target film imdbID) to local storage
  //  note: save only imdbID (filmToSave) in local storage
  //  change watchlist card button icon to 'minus' 



  // let or const?
  let watchlistFromStorage = getWatchlistFromStorage(); // check for watchlisted films
  console.log(watchlistFromStorage); // debug
  // *** ToDo: Make this a ternary statement
  if (watchlistFromStorage.includes(filmToSave)) {
    alert('Film is already saved to watchlist');
  } else {   
    console.log('saving to watchlist... ', filmToSave) 
    watchlistFromStorage.push(filmToSave); // push film (imdbID) to storage array
    // set local storage array, convert to JSON
    localStorage.setItem('watchlistFilms', JSON.stringify(watchlistFromStorage));
  }


}

// pull from localStorage to populate watchlist
function getWatchlistFromStorage() {
  let watchlist; 

  // ToDo: make below a ternary statement
  if (!localStorage.getItem('watchlistFilms')) { // if there is no watchlist
    watchlist = []; // set watchlistFromStorage to []
  } else { // otherwise, get the watchlist from ls
    watchlist = JSON.parse(localStorage.getItem('watchlistFilms'));
  }

  return watchlist; // empty array or the array from local storage

}

// check search results for films already in watchlist
function checkForWatchlistedResults() {

}



// remove film from watchlist
function removeFromWatchlist() {

}

// ToDo: Additional Functions:
// clear all watchlist items? 
// show spinner for loading films
// hide spinner for loading films
// show/hide error modal

function render(resultsData) {
  const resultsGrid = document.getElementById('results-grid');
  const filmPlaceholder = document.getElementById('film-placeholder');

  filmPlaceholder.style.display = 'none';

  // build film cards based on search results received
  console.log('rendering: ', resultsData); // debug

  resultsData.forEach(result => {
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
        <button data-film="${imdbID}" class="btn card-btn"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
        <p class="card-body">${Plot}</p>
      </div>
      `

    resultsGrid.appendChild(card)
  });


}



// *** Previous Code **** //
// ********************** //

// const searchInput = document.getElementById('search-input');
// const searchBtn = document.getElementById('search-btn');


// searchBtn.addEventListener('click', () => {
//   searchMovies();
//   searchInput.value = '';
// })

// additional fetch request for returned movies, getting movie details by IMDb ID ('i' param)
// async function getMovieDetails(moviesArray) {
//   const movieResults = [];
//   for (let movie of moviesArray) {
//     const res = await fetch(`http://www.omdbapi.com/?apikey=9da4b049&i=${movie.imdbID}`)
//     const data = await res.json();
//     movieResults.push(data)
//   }

//   refineMovieDetails(movieResults)
// }



/*
  searchResults.forEach(result => {
    const { Poster, Title, imdbRating, Runtime, Genre, Plot } = result;

    // build result card
    const card = document.createElement('div');
    card.classList.add('card');
    // build poster image for card
    const imageEl = document.createElement('img');
    imageEl.classList.add('card-img');
    imageEl.src = `${Poster}`;
    imageEl.alt = `${Title} poster`;
    card.append(imageEl);
    // build card content el
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    // build card header
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    // build card title
    const cardTitle = document.createElement('h3');
    cardTitle.classList.add('card-title');
    // build 


  });

}
*/