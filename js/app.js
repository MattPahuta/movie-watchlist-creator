// api key: 9da4b049
/* OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=9da4b049
  http://www.omdbapi.com/?apikey=[yourkey]&
  http://www.omdbapi.com/?t=batman
*/

const titleInput = document.getElementById('title-input');
const movieResultsContainer = document.getElementById('search-results');

// make request to omdb api for movie titles
async function searchMovies() {
  const apiKey = '9da4b049'; // move out of the function?

  const searchTerm = titleInput.value;
  const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`)
  const data = await res.json();
  console.log('Raw search: ', data.Search); // debug

  const searchResults = []

  for (let movie of data.Search) { // use map for this?
    const res = await fetch(`http://www.omdbapi.com/?apikey=9da4b049&i=${movie.imdbID}`);
    const data = await res.json();
    searchResults.push(data)
  }

  console.log('Search results: ', searchResults) // debug
  refineMovieDetails(searchResults)
}

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

function refineMovieDetails(moviesWithDetails) { // move this logic into the render function
  // destructure movies array with props ???
  console.log(moviesWithDetails)
  const moviesRefined = [];
  // loop through raw results and push desired props to new array
  for (let movie of moviesWithDetails) {
    const { Poster, Title, imdbRating, Runtime, Genre, Plot } = movie;

    // const movieData = {
    //   Poster: movie.Poster,
    //   Title: movie.Title,
    //   Rating: movie.imdbRating,
    //   Runtime: movie.Runtime,
    //   Genre: movie.Genre,
    //   Plot: movie.Plot
    // }

    // moviesRefined.push(movieData);
    moviesRefined.push(movie)
  }
  console.log(moviesRefined)

  renderMovies(moviesRefined);

}

function renderMovies(movies) {

  let moviesHtml = '';

  for (let movie of movies) {
    moviesHtml += 
    `
    <div class="movie-card">
    <img src="${movie.Poster}" alt="" class="movie-img">
     <div class="card-content">
      <div class="card-header">
        <h2 class="card-title">${movie.Title}</h2>
        <p class="rating"><i class="fa-solid fa-star"></i><span>${movie.imdbRating}</span></p>
    </div>
      <div class="card-meta">
        <span class="card-runtime">${movie.Runtime}</span>
        <span class="card-genre">${movie.Genre}</span>
        <span class="card-btn"><i class="fa-solid fa-circle-plus"></i> Watchlist</span>
      </div>
      <p class="card-body">${movie.Plot}</p>
    </div>
    </div>
  `
  }
  movieResultsContainer.innerHTML = moviesHtml;

}

// save selected movies to localStorage
function saveToWatchlist() {

}

// pull from localStorage to populate watchlist
function getWatchlistMovies() {

}

// listen on form submit to query api
document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  searchMovies();
  titleInput.value = '';
})

