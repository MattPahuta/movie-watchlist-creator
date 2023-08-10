<!-- JS Refactor Notes -->


## General refactor notes

- Break API key and base url into seperate variables, make uppercase consts

- ToDo: refactor checkForSavedFilms function to account for updated async function

## Async function refactor notes
And here is a more detailed explanation of how the refactored search function works. I meant to put this in the reviewNotes file, but didn't remember until after I recorded the review (so if I wanted to include it there I would have had to re-record).

The handleSearch function is an asynchronous function that is called when the user submits a search form. It prevents the default form submission behavior, gets the trimmed search term from the input field, and checks if the search term is empty. If it's empty, an alert is shown, and the function exits.

Inside the try block, the code first clears the existing search results grid, hides any error messages, and displays the loading indicator.

It then makes a fetch request to the OMDB API using the search term to retrieve initial search results (movie titles). This is done using the fetchOMDBData function.

The next part is the key step: using Promise.all(). It maps over each movie result in the data.Search array and constructs an array of promises for fetching detailed information about each movie using its IMDB ID. This is achieved by calling the fetchOMDBData function for each movie's IMDB ID.

The await Promise.all(...) line waits for all the promises in the array to resolve. This ensures that all the detailed movie information is fetched before proceeding.

After the fetching is complete, the code renders the search results by calling the renderFilmCards function, checks if any films are saved in the watchlist, and hides the loading indicator.

In case of an error during fetching or processing, the catch block catches the error, hides the loading indicator, and displays the error message using the errorToggle function.

The fetchOMDBData function is a utility function that takes a URL and performs a fetch request, awaiting the response, and then parsing and returning the JSON data.

This function structure ensures that search results are fetched and displayed asynchronously while providing proper error handling and user feedback. It leverages the power of Promise.all() to fetch detailed information for multiple movies in parallel, improving performance and user experience.