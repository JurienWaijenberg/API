import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import fs from 'node:fs';

const engine = new Liquid({
  extname: '.liquid'
});

const app = new App();

app
  .use(logger())
  .use('/', sirv('dist/assets'))
  .use('/', sirv('src'))
  .use('/', sirv('views'))
  .use('/', sirv('components/poster'))
  .listen(3000);

app.get('/', async (req, res) => {
  const movieData = await getMovies();

  const movieIds = [];

  movieData.results.forEach(result => {
    movieIds.push(result.id);
  })
  console.log(movieIds);



  // Array to store fetched movie trailers
  let movieTrailers = [];

// Fetch data for each movie ID
await Promise.all(movieIds.map(async movieKey => {
  const response2 = await fetch(`https://api.themoviedb.org/3/movie/${movieKey}/videos?api_key=${process.env.MOVIEDB_TOKEN}`);
  const data2 = await response2.json();

  const results = data2.results;
  
  if (results) {
    // Flag to check if a trailer is found for the current movie
    let trailerFound = false;
    
    // Loop through the results
    for (const result of results) {
      // Check if the type is 'Trailer'
      if (result.type === 'Trailer') {
        // If found, push the key to movieTrailers array
        movieTrailers.push(result.key);
        // Set the flag to true to indicate a trailer is found
        trailerFound = true;
        // Exit the loop since we found what we were looking for
        break;
      }
    }
    
    // If no trailer is found, push null to movieTrailers array
    // if (!trailerFound) {
    //   movieTrailers.push(null);
    // }
  }
}));


  // const movieTrailers = await fetch (`https://api.themoviedb.org/3/movie/${movieIds}/videos?api_key=${process.env.MOVIEDB_TOKEN}`).then(res => res.json());
  // const resultIds = movieTrailers.results.key;
    // const trailerIds = [];

    // movieTrailers.results.forEach(result => {
    //   trailerIds.push(result.key);
    // })

 
    console.log("All trailer data", movieTrailers);
  // console.log(movieData);

  return res.send(renderTemplate('views/index.liquid', { title: 'Movies', movieData , movieTrailers }));
  return res.send(renderTemplate('views/index.liquid', { title: 'Home' }));
});

app.get('/movie/:id/', async (req, res) => {
  const movieId = req.params.id;
  const movie = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.MOVIEDB_TOKEN}`).then(res => res.json());
  const movieTrailer = await fetch (`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.MOVIEDB_TOKEN}`).then(res => res.json());
  
  let resultId = null;

  movieTrailer.results.forEach(result => {
    // Check if the type is 'Trailer'
    if (result.type === 'Trailer') {
      // If found, assign the key to the trailerKey variable
      resultId = result.key;
      // Exit the loop since we found what we were looking for
      return;
    }
  });
  
  // const resultId = movieTrailer.results[0].key;
  // console.log(movie);
  console.log(resultId);
  return res.send(renderTemplate('views/detail.liquid', { title: 'Movie', movie , resultId}));
});

app.get('/search', async (req, res) => {
  const searchTerm = req.query.term;
  
  const movieSearch = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=${process.env.MOVIEDB_TOKEN}`).then(res => res.json());
  console.log(movieSearch);
  return res.send(renderTemplate('views/search-results.liquid', { title: 'Search results', movieSearch }));

  
});



const getMovies = async () => {
  const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${process.env.MOVIEDB_TOKEN}`);
  const movieData = await response.json();
  // console.log('movieData', movieData);

  return movieData;
};


const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };

  return engine.renderFileSync(template, templateData);
};


// // Array to store the IDs
// const resultIds = [];

// // Loop through each result and extract the IDs
// jsonData.results.forEach(result => {
//   resultIds.push(result.id);
// });
