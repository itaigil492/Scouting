var express = require('express');
var client = require('../lib/elasticsearch/connection');
var fs = require('fs');
var router = express.Router();


/* POST upload page. */
var handleUpload = function (req, res) {
    var body = req.body;
    console.log(body);
    var blueTeams = req.body.blueTeam.split(",");
    var redTeams = req.body.redTeam.split(",");
    var gameid = req.body.gameid;
    var matchType = req.body.matchType;
    var comments = req.body.comments;
    var competition = req.body.competition.toLowerCase();



    var d = new Date();
    var gameUploadTime = Math.round(d.getTime() / 1000);

    client.index({
        // teams/team/4590 : {}
        index: 'games',
        id: gameid,
        type: matchType,
        body: {
            "blueTeams": blueTeams,
            "redTeams": redTeams,
            "comments": comments,
            "gameId": gameid,
            "date": gameUploadTime,
            "competition": competition
        }
    }, function (err, resp, status) {
        console.log(resp);
        if (err) {
            console.log(err);
            res.sendStatus(500); // Internal server error
        } else {
            /// .   .   .   Insert into ES and get gameid
            res.render('upload', {
                success: 1,
                firstTime: 0,
                gameId: parseInt(gameid) + 1
            });
        }
    });

};


/* GET upload page. */
router.get('/', function (req, res, next) {
    client.search({
        index: 'games',
        body: {
            aggs: {
                max_gameid: {
                    max: {
                        field: "gameId"
                    }
                }
            }
        }
    }, function (error, response, status) {
        if (error) {
            console.log("search error: " + error);
            res.sendStatus(500);
        } else {
            res.render('upload', {
                success: 0,
                firstTime: 1,
                gameId: (parseInt(response.aggregations.max_gameid.value + 1))
            });
        }
    });
});

module.exports = {
    router: router,
    handleUpload: handleUpload
};
