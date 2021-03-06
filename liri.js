var inquirer = require("inquirer");
var fs = require("fs");
inquirer.prompt([{
    type: "list",
    message: "Hello and welcome to LIRI, your Language Interpretor.  Choose an option below to get started:",
    choices: ["Twitter - Look up the most recent 20 tweets for any Twitter user", "Spotify - Search Spotify's database for info about a song", "OMDB - Search the OMDB for info about a movie", "File System - Execute commands on files within this system"],
    name: "choice"
}]).then(function(choice) {
    if (choice.choice == "Twitter - Look up the most recent 20 tweets for any Twitter user") {
        myTweets();
    } else if (choice.choice == "Spotify - Search Spotify's database for info about a song") {
        spotifyThisSong();
    } else if (choice.choice == "OMDB - Search the OMDB for info about a movie") {
        movieThis();
    } else {
        doWhatItSays();
    }
});

///////////////////////////////////////////////////
// TWITTER
///////////////////////////////////////////////////
function myTweets() {
    inquirer.prompt([{
        type: "input",
        message: "Ok! Enter a Twitter user's handle:",
        name: "twitterHandle"
    }]).then(function(input) {
        var keys = require("./keys.js");
        var consumerKey = keys.twitterKeys.consumer_key,
            consumerSecret = keys.twitterKeys.consumer_secret,
            accessTokenKey = keys.twitterKeys.access_token_key,
            accessTokenSecret = keys.twitterKeys.access_token_secret;
        var Twitter = require("twitter");
        var client = new Twitter({
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
            access_token_key: accessTokenKey,
            access_token_secret: accessTokenSecret
        });
        var twitterHandle = input.twitterHandle;
        var user = {screen_name: twitterHandle};
        client.get("statuses/user_timeline", user, function(err, tweets, response) {
            if (!err && response.statusCode == 200) {
                console.log(
                    "\n" +
                    "=========================================================================================" +
                    "\nHere are the 20 latest tweets, with the most recent at the top, from " + user.screen_name +
                    "\n=========================================================================================" +
                    "\n"
                );
                for (var i = 0; i < tweets.length; i++) {
                    console.log("Tweet #" + (i + 1) + ": " + tweets[i].text +
                        "\n -Tweeted on: " + tweets[i].created_at + "\n");
                }
                console.log("=========================================================================================" +
                    "\n"
                );
            } else {
                console.log(err);
            }
        });
    });
}

///////////////////////////////////////////////////
// SPOTIFY
///////////////////////////////////////////////////
function spotifyThisSong() {
    inquirer.prompt([{
        type: "input",
        message: "Great! Type in a song name:",
        name: "songName"
    }]).then(function(input) {
        var spotify = require("spotify");
        var songName = input.songName;
        if (songName == "") {
            songName = "what's my age again?";
        }
        var params = {type: "track", query: songName, limit: "20"};
        spotify.search(params, function(err, data) {
            if (!err) {
                console.log(
                    "\n" +
                    "=========================================================================================" +
                    "\nInformation for songs named " + songName +
                    "\n=========================================================================================" +
                    "\n");
                for (var i = 0; i < data.tracks.items.length; i++) {
                    console.log(
                        "Artist: " + data.tracks.items[i].artists[0].name +
                        "\nAlbum Name: " + data.tracks.items[i].album.name +
                        "\nSong Name: " + data.tracks.items[i].name +
                        "\nPreview link for song: " + data.tracks.items[i].preview_url +
                        "\n" +
                        "\n=========================================================================================" +
                        "\n"
                    );
                }
            } else {
                console.log(err);
            }
        });
    });
}

///////////////////////////////////////////////////
// OMDB
///////////////////////////////////////////////////
function movieThis() {
    inquirer.prompt([{
        type: "input",
        message: "Awesome! Type in a movie:",
        name: "movieName"
    }]).then(function(input) {
        var request = require("request");
        var movieName = input.movieName;
        if (movieName == "") {
            movieName = "Mr. Nobody";
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&r=json";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(
                    "\n" +
                    "=========================================================================================" +
                    "\nInformation for " + JSON.parse(body)["Title"] +
                    "\n=========================================================================================" +
                    "\n" +
                    "\nTitle: " + JSON.parse(body)["Title"] +
                    "\nYear: " + JSON.parse(body)["Year"] +
                    "\nRated: " + JSON.parse(body)["Rated"] +
                    "\nCountry: " + JSON.parse(body)["Country"] +
                    "\nLanguage: " + JSON.parse(body)["Language"] +
                    "\nPlot: " + JSON.parse(body)["Plot"] +
                    "\nActors: " + JSON.parse(body)["Actors"] +
                    "\nRotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] +
                    "\nRotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"] +
                    "\n" +
                    "\n=========================================================================================" +
                    "\n"
                );
            }
        });
    });
}

///////////////////////////////////////////////////
// FILE COMMANDS
///////////////////////////////////////////////////
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        var dataArr = data.split(",");
        if (dataArr[0] == "my-tweets") {
            var keys = require("./keys.js");
            var consumerKey = keys.twitterKeys.consumer_key,
                consumerSecret = keys.twitterKeys.consumer_secret,
                accessTokenKey = keys.twitterKeys.access_token_key,
                accessTokenSecret = keys.twitterKeys.access_token_secret;
            var Twitter = require("twitter");
            var client = new Twitter({
                consumer_key: consumerKey,
                consumer_secret: consumerSecret,
                access_token_key: accessTokenKey,
                access_token_secret: accessTokenSecret
            });
            var user = {screen_name: dataArr[1]};
            client.get("statuses/user_timeline", user, function(err, tweets, response) {
                if (!err && response.statusCode == 200) {
                    console.log(
                        "\n" +
                        "=========================================================================================" +
                        "\nHere are the 20 latest tweets, with the most recent at the top, from " + user.screen_name +
                        "\n=========================================================================================" +
                        "\n"
                    );
                    for (var i = 0; i < tweets.length; i++) {
                        console.log("Tweet #" + (i + 1) + ": " + tweets[i].text +
                            "\n -Tweeted on: " + tweets[i].created_at + "\n");
                    }
                    console.log("=========================================================================================" +
                        "\n"
                    );
                } else {
                    console.log(err);
                }
            });
        }

        if (dataArr[0] == "spotify-this-song") {
            var params = {type: "track", query: dataArr[1]};
            var spotify = require("spotify");
            spotify.search(params, function(err, data) {
                if (!err) {
                    console.log(
                        "\n" +
                        "=========================================================================================" +
                        "\nInformation for songs named " + dataArr[1] +
                        "\n=========================================================================================" +
                        "\n");
                    for (var i = 0; i < data.tracks.items.length; i++) {
                        console.log(
                            "Artist: " + data.tracks.items[i].artists[0].name +
                            "\nAlbum Name: " + data.tracks.items[i].album.name +
                            "\nSong Name: " + data.tracks.items[i].name +
                            "\nPreview link for song: " + data.tracks.items[i].preview_url +
                            "\n" +
                            "\n=========================================================================================" +
                            "\n"
                        );
                    }
                } else {
                    console.log(err);
                }
            });
        }

        if (dataArr[0] == "movie-this") {
            var request = require("request");
            var movieName = dataArr[1];
            if (movieName == "") {
                movieName = "Mr. Nobody";
            }
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";
            request(queryUrl, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(
                        "\n" +
                        "=========================================================================================" +
                        "\nInformation for " + JSON.parse(body)["Title"] +
                        "\n=========================================================================================" +
                        "\n" +
                        "\nTitle: " + JSON.parse(body)["Title"] +
                        "\nYear: " + JSON.parse(body)["Year"] +
                        "\nRated: " + JSON.parse(body)["Rated"] +
                        "\nCountry: " + JSON.parse(body)["Country"] +
                        "\nLanguage: " + JSON.parse(body)["Language"] +
                        "\nPlot: " + JSON.parse(body)["Plot"] +
                        "\nActors: " + JSON.parse(body)["Actors"] +
                        "\nIMDB Rating: " + JSON.parse(body)["imdbRating"] +
                        "\nPoster URL: " + JSON.parse(body)["Poster"] +
                        "\n" +
                        "\n=========================================================================================" +
                        "\n"
                    );
                }
            });
        }
    });
}
