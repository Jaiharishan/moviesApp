// moviesDB api key
const apiKey = '8a97f7865d4eff98246cbfec281e792f';

// api endpoints
const url = 'https://api.themoviedb.org/3/search/movie?api_key=8a97f7865d4eff98246cbfec281e792f';
const imageUrl = 'https://image.tmdb.org/t/p/w500';


// to get the cast of the movie
function castUrl(movie_id) {
    return `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=8a97f7865d4eff98246cbfec281e792f`
}


// search button
const searchButton = document.querySelector('#search');
const moviesInput = document.querySelector('#moviesValue');
const moviesSearchContainer = document.querySelector('#movies-searchable');


function moviesSection(movies) {
    return movies.map(movie => {
        if (movie.poster_path) {
            
            return `
                    <img src=${imageUrl + movie.poster_path} data-movie-id=${movie.id}>
                `  
        }
        
    })
}


function movieCasts(movies) {
    return movies.map(movie => {
        let casts = [];
            
        // fetching cast details from the api
        fetch(castUrl(movie.id))
            .then(res => res.json())
            .then(data => {
                    data.cast.forEach(movie_cast => {
                        casts.push([movie_cast.original_name, movie_cast.character]);

                });
                    
            })
            .catch(err => console.log(err));
            
        // console.log(casts);
        let castsElement = document.createElement('div');
        

        casts.forEach(cast => {
            let castinfo = document.createElement('p');
            castinfo.innerHTML = cast[0] + ' as ' + cast[1];
            castsElement.appendChild(castinfo);
        });

        return castsElement;
    })
        
}


function createMovies(movies) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    let moviesSectionElm = document.createElement('section');
    moviesSectionElm.setAttribute('class', 'section');
    moviesSectionElm.innerHTML = `${moviesSection(movies)}`;
    // console.log(movieCasts(movies));

    movieElement.appendChild(moviesSectionElm);
    return movieElement;
}


function searchAndGenerateMovies(data) {
    // removing already existing movies
    moviesSearchContainer.innerHTML = '';

    const moviesResult = data.results;
    console.log(moviesResult);
    const movies = createMovies(moviesResult);
    moviesSearchContainer.appendChild(movies);
}

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(moviesInput.value);
    const value = moviesInput.value;

    const ourUrl = url + '&query=' + value

    fetch(ourUrl)
        .then((res) => res.json())
        .then((data) => {
            searchAndGenerateMovies(data)
        })
        .catch((err) => console.log(err))

    // emptying the search bar
    moviesInput.value = '';
})