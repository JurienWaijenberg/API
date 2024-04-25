# API 

## De opdracht

Ik heb er voor gekozen om tijdens dit project een eigen streamplatform te maken. Hiervoor ga ik gebruik maken van de MovieDB API. In mijn server-side gerenderde applicatie ligt de focus voornamelijk op de trailers van de films. Op de homepagina is dit dan ook het eerste wat naar voren komt. Een trailer geeft een goed beeld van de film. Na een trailer weet je eigenlijk al gelijk of je deze film ook wilt zien of niet. Naast de home pagina is het de opdracht om ook een detailpagina te maken. Ook hier staat de trailer centraal.

## Week 1

Aan de start van de eerste week hebben we de opdracht uitgelegt gekregen. De opdracht zelf vindt ik heel gaaf. Wat ik wilde gaan doen voor de opdracht vond ik nog erg lastig. Ik heb er uiteindelijk voor gekozen voor het streamingplatform. Hier was al een basis voor die we konden gebruiken. Zelf heb ik erg weinig ervaring met server-side gerenderde applicaties dus leek het mee een verstandig idee om hiermee te beginnen.

De basis van Github af halen en alles werkend krijgen is me de eerste week gelukt. Hoe ik nu verder wilde gaan wist ik nog niet.

## Feedbackgesprek Declan

Het eerste feedbackgesprek heb ik gemist. Gelukkig was ik de week daarna weer beter en heb ik Declan op maandag gesproken. Hij gaf aan dat het belangrijk is om eerst een concept te bedenken en daarna verder te gaan met bouwen.

## Week 2

In week twee wist ik nog steeds niet zo goed wat ik nu wil gaan maken en wat de gebruiker zou kunnen op mijn applicatie. Omdat ik hierop vast liep ben ik me iets meer gaan focussen op wat losse functies die ik kan gebruiken voor mijn uiteindelijke concept. Ik heb deze week bijvoorbeeld mee gedaan met de curses van Declan hoe je een zoekfunctie maakt in je applicatie.

Ik heb aan de header een formulier toegevoegd die de zoekopdracht verstuurt naar /search. Deze zoekopdracht wordt afgehandelt door de code hieronder. De zoekterm wordt als waarde toegekent aan searchTerm. Deze searchTerm wordt vervolgens toegevoegd aan de url van api waarmee de data met die zoekopdracht wordt aangevraagt. De data wordt vervolgens verstuurt naar search-results.liquid. Dit is de pagina waarop de data wordt weergegeven. Op het moment ziet die er nog het zelfde uit als de home pagina.

```js
app.get('/search', async (req, res) => {
  const searchTerm = req.query.term;
  
  const movieSearch = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=${process.env.MOVIEDB_TOKEN}`).then(res => res.json());
  console.log(movieSearch);
  return res.send(renderTemplate('views/search-results.liquid', { title: 'Search results', movieSearch }));

  
});
```

## Feedbackgesprek Cyd

Tijdens het gesprek met Cyd kwam ook de vraag, wat is je concept. En ook hier kon ik daar nog geen antwoord op geven. Los daarvan vond ze wel dat de basis goed is. 

## Week 3

In week 3 heb ik de curus van Cyd over GSAP gevolgt. Animaties is iets wat ik altijd al erg interresant heb gevonden, maar ook lastig. Aan mijn project zelf heb ik weinig gewerkt. Het is me gelukt om een share knop toe te voegen aan de detail pagina. Deze functie haalt de huidige url op om deze vervolgens te delen. Ook deze week is het me niet gelukt om een gaaf concept te bedenken. Hierdoor is mijn focus ook verschoven naar het andere vak HCD.

## Feedbackgesprek Declan

Tijdens het laatste gesprek met Declan heb ik laten zien wat ik op dat moment had. Wat nog steeds niet heel veel meer was dan eind week 2. 

## Week 4

De laatste week is aangebroken en ik ben vlink aan de bak gegaan. Er is eindelijk een balletje gaan rollen met wat concepten waar ik verder mee kan. 
Zelf mer ik dat op veel streamings platformen het niet duidelijk welk geluidsbestand de film gebruikt(bijvoorbeeld Dolby Atmos). En als dit er wel is is er geen mogelijkheid om hier op te filteren. Mijn idee was dus om een applicatie te maken waar alleen films te vinden zijn die gebruik maken van surround sound op wat voor manier dan ook.

Ik heb wat onderzoek gedaan en kwam erachter dat veel streamingsplatformen dit nog niet ondersteunen. Ook is deze data nog niet te verkijgen bij TMDB. Als je deze ervaring wilt ben je voor als nog gedwongen om naar de bioscoop te gaan. Dit is uiteindelijk ook mijn concept geworden. Ik heb een applicatie gemaakt waarbij je kan zien welke populaire films er in de bios draaien. Binnen de applicatie ligt de focus vooral op de trailers van de films. Zelf denk ik dat dit een van de belangrijkste factoren is om te kiezen of je naar die film wilt of niet. 

In de applicatie haal ik nu op twee manieren filmdata naar voren. Op de homepagina worden als eerste de meest populaire trailers laten zien. Dit is een best omslachtig proces geweest. Om dit werkend te krijgen heb ik eerst alle populaire films opgehaald.

```js
const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?language=en-US&api_key=${process.env.MOVIEDB_TOKEN}`);
const movieData = await response.json();
```

Hier heb ik alle id's uit gefilterd om deze vervolgens te gebruiken om de movie data op te halen. Wat je hier vervolgens van terug krijgt is een array met data. Waaronder wat voor type movie het is en wat hier de key naar youtube is. Een film heeft bijvoorbeeld interviews, behind the scenes maar ook trailers. Ik heb hiervoor een functie gemaakt die zoekt of het type movie trailer is en als dat zo de key van youtube op te slaan. Ook zorgt de functie er voor dat wanneer een film meerdere trailers heeft er maar eentje wordt opgeslagen. De functie is hieronder te zien. De youtube keys stuur ik vervolgens door naar het template waar de youtube iframes worden gegenereert.

```js
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
    
  }
}));
```

Daarnaast gebruik ik een API om de films op te halen die nu in de bioscoop draaien te laten zien. Ook deze dat wordt ingeladen op de home pagina. De data die ik hier gebruik is de poster, titel en link naar de detail pagina van de film zelf. Op de detail pagina ligt de focus ook op detrailer en is dus groot als eerst te zien. Hieronder is wat uitgebreidere informatie te vinden.

```js
const responseNowPlaying = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${process.env.MOVIEDB_TOKEN}`);
const nowPlaying = await responseNowPlaying.json()
```

## Conclusie

Voor mij zijn dit lastige weken geweest. Ik liep erg vast op het concept zelf waardoor ik niet heel veel verder kon. Toch ben ik blij met het eindresultaat. Ik heb de laatste week erg hard gewerkt om een applictatie te maken die echt van mij is, zowel qua concept als technisch. Dit is een project die ik in de toekomst vaak zal gebruiken wanneer ik iets ga maken wat serverside gerendert moet worden.