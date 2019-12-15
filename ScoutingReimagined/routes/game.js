var express = require('express');
var router = express.Router();
var client = require('../lib/elasticsearch/connection');

/* GET home page. */
router.get('/', function(req, res, next) {
    var gameId = req.query.gameId;
    var teamNumber = req.query.teamNumber;
    var matchType = req.query.type;



    client.search({
        index: 'games',
        body: {
            query: {
                match: {
                    _id: gameId
                }
            }
        }
    }, function (error, response, status) {
        if (error) {
            console.log("search error: " + error);
            console.log("error status: " + status);
            if (status == 400) {
                res.redirect('/games');
            } else {
                res.sendStatus(500);
            }
        } else {
            if (!response['hits'] || response['hits'].total == 0) {
                res.sendStatus(404);
                return;
            }
            console.log("Response got from elasticsearch on game: " + JSON.stringify(response));
            var data = response.hits.hits[0]._source;
            res.render('game', {teamNumber: teamNumber, gameId: gameId, matchType: matchType,
                                blueTeams: data.blueTeams, redTeams: data.redTeams, competition: data.competition});
        }
    });


});

module.exports = router;
