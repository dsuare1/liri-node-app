var action = process.argv[2];

///////////////////////////////////////////////////
// SWITCH CASES
///////////////////////////////////////////////////
switch (action) {
    case 'my-tweets':
        myTweets();
        break;

    case 'spotify-this-song':
        spotifyThisSong();
        break;

    case 'movie-this':
        movieThis();
        break;

    case 'do-what-it-says':
        doWhatItSays();
        break;
}

///////////////////////////////////////////////////
// TWITTER
///////////////////////////////////////////////////
function myTweets() {

    var keys = require("./keys.js");

    var consumerKey = keys.twitterKeys.consumer_key,
        consumerSecret = keys.twitterKeys.consumer_secret,
        accessTokenKey = keys.twitterKeys.access_token_key,
        accessTokenSecret = keys.twitterKeys.access_token_secret;

    // console.log(consumerKey);
    // console.log(consumerSecret);
    // console.log(accessTokenKey);
    // console.log(accessTokenSecret);

    var Twitter = require("twitter");

    var client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token_key: accessTokenKey,
        access_token_secret: accessTokenSecret
    });

    var params = { screen_name: 'rickrez22', count: 20 };

    client.get('statuses/user_timeline', params, function(err, tweets, response) {
        console.log(tweets.length);
        if (!err && response.statusCode == 200) {
            for (var i = 1; i < tweets.length; i++) {
                console.log("Tweet #" + i + ": " + tweets[i].text);
            }
        } else {
            console.log(err);
        }
    });

}

///////////////////////////////////////////////////
// SPOTIFY
///////////////////////////////////////////////////
// artist			default = "What's My Age Again?" by Blink 182
// album name
// song name
// preview link of song
// genre

function spotifyThisSong() {

    var spotify = require('spotify');

    var song = process.argv[3];

    spotify.search({type: 'track', query: song}, function(err, data) {
        if (!err) {
            console.log(data.tracks.items);
            return;
        } else {
            console.log(err);
        }
    });
}


///////////////////////////////////////////////////
// OMDB
///////////////////////////////////////////////////
// Title			default = "Mr. Nobody"

function movieThis() {

    var request = require('request');

    var movieName = "";

    for (var i = 3; i < process.argv.length; i++) {
        if (i > 3 && i < process.argv.length) {
            movieName = movieName + "%20" + process.argv[i];
        } else {
            movieName += process.argv[i];
        }
    }

    var queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&r=json';
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode == 200) {

            console.log("Title: " + JSON.parse(body)["Title"] +
                "\nYear: " + JSON.parse(body)["Year"] +
                "\nIMDB Rating: " + JSON.parse(body)["imdbRating"] +
                "\nCountry: " + JSON.parse(body)["Country"] +
                "\nLanguage: " + JSON.parse(body)["Language"] +
                "\nPlot: " + JSON.parse(body)["Plot"] +
                "\nActors: " + JSON.parse(body)["Actors"] +
                "\nRotten Tomatoes Rating (NEED TO UPDATE): " + JSON.parse(body)["imdbRating"] +
                "\nRotten Tomatoes Url(NEED TO UPDATE): " + JSON.parse(body)["Poster"]
            );
        }
    });
}

///////////////////////////////////////////////////
// FILE COMMANDS
///////////////////////////////////////////////////
