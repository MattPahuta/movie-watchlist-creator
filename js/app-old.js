// *** ToDo: more complete watchlist in localStorage (all necessary props)
//  - single watchlist to work with
//  - ability to consolidate 2x render functions into one?

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
  if (e.target.classList.contains('card-add-btn')) {
    const filmToSave = e.target.dataset.film; // imdbID as unique data attribute
    // console.log(e.target)
    saveToWatchlist(filmToSave); // call saveToWatchlist, passing in imdbID
  }

  if (e.target.classList.contains('card-remove-btn')) {
    const filmToRemove = e.target.dataset.film; // move out of if/else scope?
    console.log('Removing from watchlist: ', filmToRemove)
    removeFromWatchlist(filmToRemove); // remove film from ls watchlist
    fetchWatchlistContent(); // fetch the updated watchlist
  }


})



// make request to omdb api for movie titles
async function searchByTitle() {
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




function renderWatchlist(watchlistData) { // watchlistData
  const watchlistGrid = document.getElementById('watchlist-grid');

  // clear previous watchlist content
  while (watchlistGrid.firstChild) {
    watchlistGrid.removeChild(watchlistGrid.firstChild);
  }

  // watchlistData => localStorageWatchlist
  watchlistData.forEach(result => {
    const { Poster, Title, imdbID, imdbRating, Runtime, Genre, Plot } = result;

    // build result card
    const card = document.createElement('div');
    card.classList.add('card');

    // ToDo: Handle props with 'N/A' - placeholder div for posters ('poster not available'), etc.
    // ToDo: Add logic to add minus icon instead of plus if rendering the watchlist

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
        <button data-film="${imdbID}" class="btn card-remove-btn"><i class="fa-solid fa-circle-minus"></i> Watchlist</button>
        <p class="card-body">${Plot}</p>
      </div>
      `

    watchlistGrid.appendChild(card)
  });
}

// Get watchlist content from API 
// *** Reviewer question - Is this function hacky? A more elegant way to do it?
async function fetchWatchlistContent() {

  console.log('watchlist from storage: ', localStorageWatchlist)
  // check that watchlist in local storage has a length > 0
  if (localStorageWatchlist.length > 0) { // or, just watchlist.length? 
    // hide the placeholder content on watchlist.html


    const watchlistContent = []; // holds the complete data for watchlist items
    for (film of localStorageWatchlist) {
      try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${film}`);
        const data = await res.json();
        console.log(data)
        watchlistContent.push(data)
      } catch(error) {
        console.error(error)
        // render and error message to html
      }

    }
    renderWatchlist(watchlistContent);

  } else {
    console.log('No watchlist data')
    renderWatchlist([])
  }

}


// save selected movies to localStorage
function saveToWatchlist(filmToSave) {
  // ToDo:
  //  make call to get full film details, save complete data in local storage
  //  change watchlist card button icon to 'check mark; ?
  //  add modal confirming film title saved to watchlist

  // let or const?
  // let watchlistFromStorage = getWatchlistFromStorage(); // check for watchlisted films

  console.log('LS Watchlist: ', localStorageWatchlist); // debug
  // *** ToDo: Make this a ternary statement
  if (localStorageWatchlist.includes(filmToSave)) { // check if film already in watchlist
    alert('Film is already saved to watchlist');
  } else {   
    console.log('saving to watchlist... ', filmToSave) 
    const filmContent = fetchFilmContent(filmToSave)
    localStorageWatchlist.push(filmContent); // push film (imdbID) to storage array
    // set local storage array, convert to JSON
    localStorage.setItem('watchlistFilms', JSON.stringify(localStorageWatchlist));
  }


}

// get the full details of the film
async function fetchFilmContent(film) {
  const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${film}`);
  const data = await res.json();
  return data;
}

// remove film from watchlist
function removeFromWatchlist(filmToRemove) {
  // filmToRemove = imdbID (unique ID saved in watchlist ls array)
  // let watchlistFromStorage = getWatchlistFromStorage();

  // filter out the filmToRemove
  const updatedWL = localStorageWatchlist.filter(film => film !== filmToRemove);
  // reset the watchlist in local storage
  localStorage.setItem('watchlistFilms', JSON.stringify(updatedWL));

}


// ToDo: Additional Functions:
// clear all watchlist items? 
// show spinner for loading films
// hide spinner for loading films
// show/hide error modal

function render(resultsData) { // make this more generic => data, filmData, etc.
  const resultsGrid = document.getElementById('results-grid');
  // const filmPlaceholder = document.getElementById('film-placeholder');
  // filmPlaceholder.style.display = 'none';

  // clear results from results grid - placeholder and previous results
  while (resultsGrid.firstChild) { // clear existing results content with while loop
    resultsGrid.removeChild(resultsGrid.firstChild);
  }
  

  // build film cards based on search results received
  console.log('rendering: ', resultsData); // debug

  resultsData.forEach(result => {
    const { Poster, Title, imdbID, imdbRating, Runtime, Genre, Plot } = result;

    // build result card
    const card = document.createElement('div');
    card.classList.add('card');

    // ToDo: Handle props with 'N/A' - placeholder div for posters ('poster not available'), etc.
    // ToDo: Add logic to add minus icon instead of plus if rendering the watchlist

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
        <button data-film="${imdbID}" class="btn card-add-btn"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
        <p class="card-body">${Plot}</p>
      </div>
      `

    resultsGrid.appendChild(card)
  });


}


// Router function
function init() {
  switch (document.body.id) {
    case 'home':
      // show something else?
      console.log('home page')
      break;
    case 'watchlist':

      console.log('watchlist page')
      break;

  }

}

init();


// *** Previous Code **** //
// ********************** //

// const searchInput = document.getElementById('search-input');
// const searchBtn = document.getElementById('search-btn');


/*

// pull from localStorage to populate watchlist
// function getWatchlistFromStorage() {
//   let watchlist; 

//   // ToDo: make below a ternary statement
//   if (!localStorage.getItem('watchlistFilms')) { // if there is no watchlist
//     watchlist = []; // set watchlistFromStorage to []
//   } else { // otherwise, get the watchlist from ls
//     watchlist = JSON.parse(localStorage.getItem('watchlistFilms'));
//   }

//   return watchlist; // empty array or the array from local storage

// }

// save selected movies to localStorage
function saveToWatchlist(filmToSave) {
  // ToDo:
  //  note: save only imdbID (filmToSave) in local storage
  //  change watchlist card button icon to 'minus' ?
  //  add modal confirming film title saved to watchlist

  // let or const?
  let watchlistFromStorage = getWatchlistFromStorage(); // check for watchlisted films

  console.log('LS Watchlist: ', watchlistFromStorage); // debug
  // *** ToDo: Make this a ternary statement
  if (watchlistFromStorage.includes(filmToSave)) { // check if film already in watchlist
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



// remove film from watchlist
function removeFromWatchlist(filmToRemove) {
  // filmToRemove = imdbID (unique ID saved in watchlist ls array)
  let watchlistFromStorage = getWatchlistFromStorage();

  // filter out the filmToRemove
  watchlistFromStorage = watchlistFromStorage.filter(film => film !== filmToRemove);
  // reset the watchlist in local storage
  localStorage.setItem('watchlistFilms', JSON.stringify(watchlistFromStorage));

}
*/