//dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');


app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('pulic'));


var database = {
    local: 'mongod://localhost/mongo_scaping_HW',
    remote: 'mongodb://heroku_shsppdng:gtfhicbv58fjgahofnc18niebt@ds029456.mlab.com:29456/heroku_shsppdng'
}

//this connects to the remote mongoose db
var remoteDb = database.remote;
mongoose.connect(remoteDb);

db = mongoose.connection;

//this console an error if no db found
db.on('error', function(err) {
    console.log('Mongoose Error', err)
});

//this console a successful connection was made
db.once('open', function() {
    console.log('Db connection', remoteDb)
});

//local port and deployement port
var PORT = process.env.PORT || 3309;
//schemas
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');


//routes

app.get('/', function(req, res) {
    res.send(index.html);
});

//a get request to scrape from espn website
app.get('/scrape', function(req, res) {
    request('http://www.espn.com/', function(error, response, html) {

        //then we load it into cheerio and save it into $ for short-hand selector
        var $ = cheerio.load(html);

        //now we grab all the articles
        $('articles .item-info-wrap').each(function(i, element) {

            //save an empty result 
            var result = {};

            //add the text and href of every link
            //and save them as properties of the result
            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            // using our Article model, create a new entry.
            // Notice the (result):
            // This effectively passes the result object to the entry (and the title and link)
            var entry = new Article(result);

            //now save that entry to the db
            entry.save(function(err, doc) {

                //log any error
                if (err) {
                    console.log(err);
                }
                // or log the doc
                else {
                    console.log(doc)
                }

            });
        });


    });

    // tell the brower that we finshed scraping 
    res.send("Scrape Complete");
});
