// moviesDB api key
const apiKey = '8a97f7865d4eff98246cbfec281e792f';

// api endpoints
const url = 'https://api.themoviedb.org/3/search/movie?api_key=8a97f7865d4eff98246cbfec281e792f';
const imageUrl = 'https://image.tmdb.org/t/p/w500';

// api endpoint for moviedb
const MOVIE_DB_ENDPOINT = 'https://api.themoviedb.org';

// api endpoint for movie image in moviedb
const MOVIE_DB_IMAGE_ENDPOINT = 'https://image.tmdb.org/t/p/w500';



// to generate dynamic urls
function generateMovieDBUrl(path) {
    const url = `${MOVIE_DB_ENDPOINT}/3${path}?api_key=${apiKey}`;
    return url;
}


// to get the cast of the movie
function castUrl(movie_id) {
    return `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=8a97f7865d4eff98246cbfec281e792f`
}



// all document elements are defined here
const searchButton = document.querySelector('#search');
const moviesInput = document.querySelector('#moviesValue');
const moviesSearchContainer = document.querySelector('#movies-searchable');
const moviesContainer = document.querySelector('#movies-container');



// to generate image of searched movies
function moviesSection(movies) {
    return movies.map(movie => {
        if (movie.poster_path) {
            
            let movieImg = document.createElement('img');
            movieImg.src = imageUrl + movie.poster_path;
            movieImg.setAttribute('data-movie-id', movie.id);

            return movieImg
        }
        
    })
}



// to use fetch api more simply
function requestMovies(url, success, error) {
    fetch(url)
        .then(res => res.json())
        .then(success)
        .catch(error)
}


// error function
function errorHandle(error) {
    console.log(error);
}


// for movie casts
function movieCasts(movies) {
    return movies.map(movie => {
        let castsElement = document.createElement('div');

        // fetching cast details from the api
        fetch(castUrl(movie.id))
            .then(res => res.json())
            .then(data => {

                    data.cast.forEach(movie_cast => {
                        
                        let castinfo = document.createElement('p');
                        castinfo.innerHTML = movie_cast.original_name + ' as ' + movie_cast.character;
                        castsElement.appendChild(castinfo);
                    });
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

    // images of all movies
    let movieImgs = moviesSection(movies);

    // casts of all movies
    let moviesCasts = movieCasts(movies);


    // for loop to iterate every movie and display individually
    for (let i = 0; i < movieImgs.length; i++) {
        let movieDiv = document.createElement('div');

        console.log('M' + movies[i].id);
        // modal id is create using movie id and M in front of it

        // movieimg
        movieImgs[i].setAttribute('data-bs-toggle', 'modal');
        movieImgs[i].setAttribute('data-bs-target', '#' + 'M' + movies[i].id);

        // creating modal
        let modalContainer = document.createElement('div');
        modalContainer.setAttribute('class', 'modal fade');
        modalContainer.setAttribute('id', 'M' + movies[i].id);
        modalContainer.setAttribute('tabindex', '-1');

        // modal dialog
        let modalDialog = document.createElement('div');
        modalDialog.setAttribute('class', 'modal-dialog');

        // modal content
        let modalContent = document.createElement('div');
        modalContent.setAttribute('class', 'modal-content');

        // modal header
        let modalHeader = document.createElement('div');
        modalHeader.setAttribute('class', 'modal-header');

        // inside header h5
        let h5 = document.createElement('h5');
        h5.setAttribute('class', 'modal-title');
        h5.textContent = 'Casts and ratings';

        let closeBtn = document.createElement('button');
        closeBtn.setAttribute('class', 'btn-close');
        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('data-bs-dismiss', 'modal');

        modalHeader.appendChild(h5);
        modalHeader.appendChild(closeBtn);



        // modal body
        let modalBody = document.createElement('div');
        modalBody.setAttribute('class', 'modal-body');

        // movie name
        let movieName = document.createElement('div');
        movieName.textContent = movies[i].title;
        movieName.setAttribute('class', 'h2 mb-3');
        
        // adding ratings
        let ratings = document.createElement('div');
        ratings.textContent = movies[i].vote_average + '/10';
        ratings.setAttribute('class', 'btn btn-primary text-light mb-3')

        modalBody.appendChild(ratings);


        // adding imdb rating
        let imdbRatingDiv = document.createElement('div');

        // getting the rating and adding it to imdbRatingDiv
        requestImdb(movies[i].title, imdbRatingDiv);
        
        imdbRatingDiv.setAttribute('class', 'btn btn-primary mx-2 text-light mb-3');

        modalBody.appendChild(imdbRatingDiv);

        // movie casts
        let castsHeading = document.createElement('h2');
        castsHeading.textContent = 'Casts';

        modalBody.appendChild(movieName);

        modalBody.appendChild(castsHeading);
        
        modalBody.appendChild(moviesCasts[i]);



        // modal footer
        let modalFooter = document.createElement('div');
        modalFooter.setAttribute('class', 'modal-footer');

        let footerCloseBtn = document.createElement('button');
        footerCloseBtn.setAttribute('class', 'btn btn-secondary');
        footerCloseBtn.setAttribute('type', 'button');
        footerCloseBtn.setAttribute('data-bs-dismiss', 'modal');
        footerCloseBtn.textContent = 'close';

        modalFooter.appendChild(footerCloseBtn);


        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);

        modalDialog.appendChild(modalContent);
        modalContainer.appendChild(modalDialog);

        moviesSearchContainer.appendChild(modalContainer);


        // appending to movieDiv
        movieDiv.appendChild(movieImgs[i]);

        // movie image on click should show a modal containinf casts


        moviesSectionElm.appendChild(movieDiv);
    }

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
    requestMovies(ourUrl, searchAndGenerateMovies, errorHandle)

}


// event listener to check search submission
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(moviesInput.value);
    const value = moviesInput.value;

    searchMovies(value);

    // emptying the search bar
    moviesInput.value = '';
})



// function to create default image container
function createImageContainer(imageUrl, id) {
    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('class', 'imageContainer');
    tempDiv.setAttribute('data-id', id);

    const movieElement = `
        <img src="${imageUrl}" alt="" data-movie-id="${id}">
    `;
    tempDiv.innerHTML = movieElement;

    return tempDiv;
}


// to show to rated movies
function getTopRatedMovies() {
    const url = generateMovieDBUrl(`/movie/top_rated`);
    const render = renderMovies.bind({ title: 'Top Rated Movies' })
    requestMovies(url, render, errorHandle);
}


// to get trending movies
function getTrendingMovies() {
    const url = generateMovieDBUrl('/trending/movie/day');
    const render = renderMovies.bind({ title: 'Trending Movies' })
    requestMovies(url, render, errorHandle);
}


// for showing yet to release movies
function searchUpcomingMovies() {
    const url = generateMovieDBUrl('/movie/upcoming');
    const render = renderMovies.bind({ title: 'Upcoming Movies' })
    requestMovies(url, render, errorHandle);
}


// to show popular movie
function searchPopularMovie() {
    const url = generateMovieDBUrl('/movie/popular');
    const render = renderMovies.bind({ title: 'Popular Movies' });
    requestMovies(url, render, errorHandle);
}



// to create header for a section
function createSectionHeader(title) {
    const header = document.createElement('h2');
    header.setAttribute('class', 'text-light');
    header.innerHTML = title;
    return header;
}



// to create a movie container
function createMovieContainer(section) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie mt-5');

    const template = ``;

    movieElement.innerHTML = template;
    movieElement.insertBefore(section, movieElement.firstChild);
    return movieElement;
}



// to render and show the movie image
function renderMovies(data) {
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader(this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesContainer.appendChild(moviesBlock);
}


// to get the imdb rating of a movie
function requestImdb(name, elem) {
    let nameArray = name.split(' ');
    let rating;
    let ourName = nameArray.join('_');
    fetch(`http://www.omdbapi.com/?t=${ourName}&apikey=7b1e4ad3`)
        .then(res => res.json())
        .then(data => {
            rating = data.imdbRating;
            elem.textContent = rating + '/10';            
        })
        .catch(err => console.log(err))
}



// to generate a movie section
function generateMoviesBlock(data) {
    const movies = data.results;
    const section = document.createElement('section');
    section.setAttribute('class', 'section');

    let moviesCasts = movieCasts(movies);

    for (let i = 0; i < movies.length; i++) {

        let imdbRating = requestImdb(movies[i].title);
        // console.log(imdbRating);

        // getting path and id of the movie
        const { poster_path, id } = movies[i];


        // if image exists
        if (poster_path) {
            const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;
    
            const imageContainer = createImageContainer(imageUrl, id);
            section.appendChild(imageContainer);

            // movieimg
            imageContainer.setAttribute('data-bs-toggle', 'modal');
            imageContainer.setAttribute('data-bs-target', '#' + 'M' + id);

            // creating modal
            let modalContainer = document.createElement('div');
            modalContainer.setAttribute('class', 'modal fade');
            modalContainer.setAttribute('id', 'M' + id);
            modalContainer.setAttribute('tabindex', '-1');

            // modal dialog
            let modalDialog = document.createElement('div');
            modalDialog.setAttribute('class', 'modal-dialog');

            // modal content
            let modalContent = document.createElement('div');
            modalContent.setAttribute('class', 'modal-content');


            // modal header
            let modalHeader = document.createElement('div');
            modalHeader.setAttribute('class', 'modal-header');

            // inside header
            let h5 = document.createElement('h5');
            h5.setAttribute('class', 'modal-title');
            h5.textContent = 'Casts and ratings';

            let closeBtn = document.createElement('button');
            closeBtn.setAttribute('class', 'btn-close');
            closeBtn.setAttribute('type', 'button');
            closeBtn.setAttribute('data-bs-dismiss', 'modal');

            modalHeader.appendChild(h5);
            modalHeader.appendChild(closeBtn);


            // modal body
            let modalBody = document.createElement('div');
            modalBody.setAttribute('class', 'modal-body');

            // movie name
            let movieName = document.createElement('div');
            movieName.textContent = movies[i].title;
            movieName.setAttribute('class', 'h2 mb-3');
            
            // adding ratings
            let ratings = document.createElement('div');
            ratings.textContent = movies[i].vote_average + '/10';
            ratings.setAttribute('class', 'btn btn-primary text-light mb-3')

            modalBody.appendChild(ratings);


            // adding imdb rating
            let imdbRatingDiv = document.createElement('div');

            // getting the rating and adding it to imdbRatingDiv
            requestImdb(movies[i].title, imdbRatingDiv);
            
            imdbRatingDiv.setAttribute('class', 'btn btn-primary mx-2 text-light mb-3');

            modalBody.appendChild(imdbRatingDiv);


            // movie casts
            let castsHeading = document.createElement('h2');
            castsHeading.textContent = 'Casts';

            modalBody.appendChild(movieName);

            modalBody.appendChild(castsHeading);
            
            modalBody.appendChild(moviesCasts[i]);

            
            // modal footer
            let modalFooter = document.createElement('div');
            modalFooter.setAttribute('class', 'modal-footer');

            let footerCloseBtn = document.createElement('button');
            footerCloseBtn.setAttribute('class', 'btn btn-secondary');
            footerCloseBtn.setAttribute('type', 'button');
            footerCloseBtn.setAttribute('data-bs-dismiss', 'modal');
            footerCloseBtn.textContent = 'close';

            modalFooter.appendChild(footerCloseBtn);


            // appending child elements
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modalContent.appendChild(modalFooter);

            modalDialog.appendChild(modalContent);
            modalContainer.appendChild(modalDialog);

            moviesContainer.appendChild(modalContainer);
        }
    }

    const movieSectionAndContent = createMovieContainer(section);
    return movieSectionAndContent;
}



// displaying all default movie suggestions as sections
getTopRatedMovies();

getTrendingMovies();

searchUpcomingMovies();

searchPopularMovie();