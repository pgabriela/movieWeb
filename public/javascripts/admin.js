var socket = io();
var movieListContainer;

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

document.getElementById("optionSelector").onchange = function() {
    var value = document.getElementById("optionSelector").value;
    if (value == 'addProducer') {
        document.getElementById("submitBtn").classList.remove('invisible');
        document.getElementById("formInputs").innerHTML = '<input class="form-control" name="prodAddr" type="text" placeholder="Producer Address">';
    } else if (value == 'addMovie') {
        document.getElementById("submitBtn").classList.add('invisible');
        var formInputs = document.getElementById("formInputs");
        formInputs.innerHTML = '';
        socket.on('movieList', function(movieList) {
            movieListContainer = movieList;
            var tempHTML = '';
            tempHTML += '<input class="invisible" name="movieAddr" id="movieAddr">'
            tempHTML += '<input class="invisible" name="movieTitle" id="movieTitle">'
            tempHTML += '<div class="row">';
            tempHTML += '<div class="col-2">';
            tempHTML += '<h5 style="font-weight: bold">Producer</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Title</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Release Date</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Genre</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Casts</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col-3">';
            tempHTML += '<h5 style="font-weight:bold">Description</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Country</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Price</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Action</h5>';
            tempHTML += '</div>';
            tempHTML += '</div>';

            var counter = 0;
            for (var i in movieList) {
                tempHTML += '<div class="row">';
                tempHTML += '<div class="col-2">';
                tempHTML += '<h5>' + movieList[i].prodAddr + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + toTitleCase(movieList[i].title) + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].releasedate + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].genre + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].cast + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col-3">';
                tempHTML += '<h5>' + movieList[i].description + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].country + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].price + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<button class="btn btn-outline-warning" id="addMovieBtn' + counter + '" type="submit">Add This</button>';
                tempHTML += '</div>';
                tempHTML += '</div>';
                counter++;
            }
            formInputs.innerHTML = tempHTML;
            for (let x = 0; x < counter; x++) {
                let z = document.getElementById("addMovieBtn" + x);
                let selector = x;
                z.onclick = function(e) {
                    document.getElementById("movieAddr").value = movieListContainer[selector].prodAddr;
                    document.getElementById("movieTitle").value = movieListContainer[selector].title;
                }
            }
        });
        socket.emit('queryMovies', '');
    } else if(value == 'deleteMovie'){
        document.getElementById("submitBtn").classList.add('invisible');
        var formInputs = document.getElementById("formInputs");
        formInputs.innerHTML = '';
        var tempSearchHTML = '';
        tempSearchHTML += '<div class="row">';
        tempSearchHTML += '<div class="col-4">';
        tempSearchHTML += '<input class="form-control" type="text" id="searchMovie" placeholder="Search Movie Title..."/>';
        tempSearchHTML += '</div>';
        tempSearchHTML += '<div class="col-2">';
        tempSearchHTML += '<button class="btn btn-outline-warning" id="searchMovieBtn">Search</button>';
        tempSearchHTML += '</div>';
        tempSearchHTML += '</div>';
        tempSearchHTML += '<div id="formInputs2"></div>';
        formInputs.innerHTML = tempSearchHTML;

        document.getElementById("searchMovieBtn").onclick = clickHandler;

        socket.on('movieList', function(movieList) {
            movieListContainer = movieList;
            var tempHTML = '';
            tempHTML += '<input class="invisible" name="movieAddr" id="movieAddr">'
            tempHTML += '<input class="invisible" name="movieTitle" id="movieTitle">'
            tempHTML += '<div class="row">';
            tempHTML += '<div class="col-2">';
            tempHTML += '<h5 style="font-weight: bold">Producer</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Title</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Release Date</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Genre</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Casts</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col-3">';
            tempHTML += '<h5 style="font-weight:bold">Description</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Country</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Price</h5>';
            tempHTML += '</div>';
            tempHTML += '<div class="col">';
            tempHTML += '<h5 style="font-weight:bold">Action</h5>';
            tempHTML += '</div>';
            tempHTML += '</div>';

            var counter = 0;
            for (var i in movieList) {
                tempHTML += '<div class="row">';
                tempHTML += '<div class="col-2">';
                tempHTML += '<h5>' + movieList[i].prodAddr + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + toTitleCase(movieList[i].title) + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].releasedate + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].genre + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].cast + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col-3">';
                tempHTML += '<h5>' + movieList[i].description + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].country + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<h5>' + movieList[i].price + '</h5>';
                tempHTML += '</div>';
                tempHTML += '<div class="col">';
                tempHTML += '<button class="btn btn-outline-warning" id="deleteMovieBtn' + counter + '" type="submit">Remove</button>';
                tempHTML += '</div>';
                tempHTML += '</div>';
                counter++;
            }
            document.getElementById("formInputs2").innerHTML += tempHTML;
            for (let x = 0; x < counter; x++) {
                let z = document.getElementById("deleteMovieBtn" + x);
                let selector = x;
                z.onclick = function(e) {
                    document.getElementById("movieAddr").value = movieListContainer[selector].prodAddr;
                    document.getElementById("movieTitle").value = movieListContainer[selector].title;
                }
            }
        });
    }
}

function clickHandler(e){
    e.preventDefault();
    var searchValue = $("#searchMovie").val().toLowerCase();
    document.getElementById("formInputs2").innerHTML = '';
    $("#searchMovie").val("");
    socket.emit('searchMoviesToBeDeleted', searchValue);
};
