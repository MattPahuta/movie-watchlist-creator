console.log('script connected!');
// api key: 9da4b049
/* OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=9da4b049
  http://www.omdbapi.com/?apikey=[yourkey]&
  http://www.omdbapi.com/?t=batman
*/
const apiKey = '9da4b049';
const searchForm = document.getElementById('search-form');
const titleInput = document.getElementById('title-input');
const movieResultsContainer = document.getElementById('search-results');

// make request to omdb api for movie titles
async function searchMovies() {
  const searchTerm = titleInput.value;
  const res = await fetch(`http://www.omdbapi.com/?apikey=9da4b049&s=${searchTerm}`)
  const data = await res.json();
  // console.log(data.Search); // results in array
  getMovieDetails(data.Search)
}

// additional fetch request for returned movies, getting movie details by IMDb ID ('i' param)
async function getMovieDetails(moviesArray) {
  // add 'query in progress' or similiar animation while building list
  const movieResults = [];
  for (let movie of moviesArray) {
    const res = await fetch(`http://www.omdbapi.com/?apikey=9da4b049&i=${movie.imdbID}`)
    const data = await res.json();
    movieResults.push(data)
  }

  // call the renderMovies function, pass in movies w/details
  refineMovieDetails(movieResults)
}

function refineMovieDetails(moviesWithDetails) {
  // destructure movies array with props ???
  // console.log(moviesWithDetails)
  const moviesRefined = [];
  // loop through raw results and push desired props to new array
  for (let movie of moviesWithDetails) {
    const movieData = {
      Poster: movie.Poster,
      Title: movie.Title,
      Rating: movie.imdbRating,
      Runtime: movie.Runtime,
      Genre: movie.Genre,
      Plot: movie.Plot
    }
    moviesRefined.push(movieData);
  }
  console.log(moviesRefined)
  // call renderMovies to handle DOM manipulation
  renderMovies(moviesRefined);
}

function renderMovies(movies) {

  let moviesHtml = '';

  for (let movie of movies) {
    moviesHtml += `<h2>${movie.Title}</h2>`
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
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchMovies();
  titleInput.value = '';
})

