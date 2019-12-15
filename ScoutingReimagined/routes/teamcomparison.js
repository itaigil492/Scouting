var express = require('express');
var client = require('../lib/elasticsearch/connection');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("getting all events..");
    getAllEvents().then(function (events) {
        res.render('teamcomparison', {'events': events});
    });
});




function getAllEvents() {
    return new Promise(function(resolve, reject) {
        client.search({
            index: 'events',
            size: 10000,
            body: {
                query: {
                    match_all: {}
                }
            }
        }, function (error, response, status) {
            if (error) {
                console.log("search error: " + error);
                reject(error);
            } else {
                resolve(response.hits.hits);
            }
        });
    });
}

module.exports = router;
