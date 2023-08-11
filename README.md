# Movie Watchlist Creator - Scrimba FEWD Project

This is a solution to the Movie Watchlist Creator solo project, as part of the Scrimba Frontend Developer Career Path, featuring the use of the [Open Movie Database API](https://www.omdbapi.com/). My solution incorporates the use of mobile-first design methodology, local storage, async/await, and other modern JavaScript methods. 

## Table of contents

- [Overview](#overview)
  - [Project requirements](#project-requirements)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### Project requirements 

- Develop a two page website: index.html and watchlist.html
- Design site according to supplied figma design comp
- index.html: search page, calls to OMDB API with the term searched, displaying results
- Each result should be displayed within page's results section
- Each result should feature a button to save film to watchlist
- watchlist.html loads and displays the watchlist, saved using local storage
- Each result displayed should feature a button to remove film from watchlist page and local storage

### Additional enhancements

- Film result images link to the film's external IMDB page
- Search result items already saved to watchlist are identified
- Number of watchlist items saved displayed on home page via counter
- Added a loading animation for film searches in-progress
- Additional design customizations and enhancements

### Screenshot

![](./images/project-ss.jpg)


### Links

- [Scrimba Scrim](https://scrimba.com/scrim/cGZZ2dTQ)
- [Live Site](https://movie-watchlist-creator.vercel.app/index.html)

## My process

### Built with 

- Mobile-first methodology
- Semantic HTML5 markup
- Flexbox
- CSS Grid
- JavaScript, including async/await

### What I learned

Nested loops have been something I've often tried to avoid. However, this particular implementation seemed like the most straightforward approach for the function I'm using to check if a search result item is already saved to the local storage watchlist.

```js
function checkForSavedFilms() {
  const watchlist = getWatchlistFromStorage();

  const savedTagHtml = `
    <p class="saved-film">
      <i class="fa-solid fa-circle-check"></i> Film Saved
    </p>`
  // loop over searchResults to match films saved in watchlist
  for (let film of searchResults) {
    for (let savedFilm of watchlist) { // loop over watchlist for each film
      if (film.imdbID === savedFilm.imdbID) { // compare imdbID
        document.querySelector(`[data-btn-container="${savedFilm.imdbID}"]`).innerHTML = savedTagHtml;
      }
    }
  }
}
```

It looks like a lot is going on in my handleSearch function, but earlier versions of this code were quite a bit more convoluted. Thanks to the helpful mentors at Scrimba (shoutout to Amy!) I was able to separate concerns in my code much more effectively and was able to implement Promise.all successfully in a project for the first time. Very excited about using these techniques and principles moving forward.

```js
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
    clearResultsGrid(); // clear previous results
    errorToggle(); // error encountered?
    showLoader(); // show the loading animation
    // fetch search results:
    const data = await fetchOMDBData(`${BASE_URL}&s=${searchTerm}`);
    const searchResults = await Promise.all(data.Search
      .map(film => fetchOMDBData(`${BASE_URL}&i=${film.imdbID}`)));

    tempSearchResults = [...searchResults]; // populate temp array for other funcs
    renderFilmCards(searchResults); // render film cards
    checkForSavedFilms(searchResults); // check result films for those already saved
    hideLoader(); // hide loading animation
  } catch (error) {
    hideLoader();
    errorToggle();
  }
}
```

## Author

- Website - [Matt Pahuta](https://www.mattpahuta.com)
- Twitter - [@mattpahuta](https://www.twitter.com/MattPahuta)
