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
            
            let movieImg = document.createElement('img');
            movieImg.src = imageUrl + movie.poster_path;
            movieImg.setAttribute('data-movie-id', movie.id);
            // return `
            //         <img src=${imageUrl + movie.poster_path} data-movie-id=${movie.id}>
            //     `  
            return movieImg
        }
        
    })
}


// to use fetch api more clearly
function fetchMovies(url, success, error) {
    fetch(url)
        .then(res => res.json())
        .then(success)
        .catch(error)
}

function errorHandle(error) {
    console.log(error);
}



// for movie casts
function movieCasts(movies) {
    return movies.map(movie => {
        let casts = [];
        let castsElement = document.createElement('div');
        // fetching cast details from the api
        fetch(castUrl(movie.id))
            .then(res => res.json())
            .then(data => {

                    // console.log(casts);
                    

                    data.cast.forEach(movie_cast => {
                        
                        let castinfo = document.createElement('p');
                        castinfo.innerHTML = movie_cast.original_name + ' as ' + movie_cast.character;
                        castsElement.appendChild(castinfo);
                        console.log(castinfo);
                        // casts.push([movie_cast.original_name, movie_cast.character]);
                    });

                    

                    // console.log(casts);
                    // casts.forEach(cast => {
                    //     let castinfo = document.createElement('p');
                    //     castinfo.innerHTML = cast[0] + ' as ' + cast[1];
                    //     console.log(castinfo);
                    //     castsElement.appendChild(castinfo);
                    // });


            })
            .catch(err => console.log(err));
        
            
        return castsElement;
            
        
    })
        
}


// this function is to create movie element
function createMovies(movies) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    // the section where all searched movies placed
    let moviesSectionElm = document.createElement('section');
    moviesSectionElm.setAttribute('class', 'section');
    let movieImgs = moviesSection(movies);
    let moviesCasts = movieCasts(movies);

    // console.log(movieImgs);
    // console.log(moviesCasts);

    for (let i = 0; i < movieImgs.length; i++) {
        let movieDiv = document.createElement('div');
        movieDiv.appendChild(movieImgs[i]);
        movieDiv.appendChild(moviesCasts[i]);
        moviesSectionElm.appendChild(movieDiv);
    }
    // movieImgs.forEach(movieImg => {
    //     moviesSectionElm.appendChild(movieImg)
    // })

    // console.log(movieCasts(movies));

    movieElement.appendChild(moviesSectionElm);
    return movieElement;
}


// to render the searched movies
function searchAndGenerateMovies(data) {
    // removing already existing movies
    moviesSearchContainer.innerHTML = '';

    const moviesResult = data.results;
    console.log(moviesResult);
    const movies = createMovies(moviesResult);
    moviesSearchContainer.appendChild(movies);
}



// the search function which handles api calls to render movie in website
function searchMovies(value) {
    // const path = '/search/movie';
    const ourUrl = url + '&query=' + value;
    fetchMovies(ourUrl, searchAndGenerateMovies, errorHandle)

}



searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(moviesInput.value);
    const value = moviesInput.value;

    
    searchMovies(value);

    // emptying the search bar
    moviesInput.value = '';
})