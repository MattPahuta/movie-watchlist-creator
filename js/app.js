// api key: 9da4b049
/* OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=9da4b049
  http://www.omdbapi.com/?apikey=[yourkey]&
  http://www.omdbapi.com/?t=batman
*/

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');


searchBtn.addEventListener('click', () => {
  console.log('clicked')
  searchMovies();
  searchInput.value = '';
})

// make request to omdb api for movie titles
async function searchMovies() {
  const apiKey = '9da4b049'; // move out of the function?

  const searchTerm = searchInput.value;
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


function render(resultsData) {
  const resultsGrid = document.getElementById('results-grid');

  // build movie cards based on search results received
  console.log('rendering: ', resultsData); // debug

  resultsData.forEach(result => {
    const { Poster, Title, imdbRating, Runtime, Genre, Plot } = result;

    // build result card
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${Poster}" alt="${Title} poster" class="card-img">
      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${Title}</h3>
          <p class="rating"><i class="fa-solid fa-star"></i><span>${imdbRating}</span></p>
        </div>
        <div class="card-meta">
          <span class="card-runtime">${Runtime}</span>
          <span class="card-genre">${Genre}</span>
        </div>
        <button class="btn card-btn"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
        <p class="card-body">${Plot}</p>
      </div>
      `

    resultsGrid.appendChild(card)
  });

}


// save selected movies to localStorage
function saveToWatchlist() {

}

// pull from localStorage to populate watchlist
function getWatchlistMovies() {

}


// *** Previous Code **** //
// ********************** //

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