var express = require('express');
var router = express.Router();
var client = require('../lib/elasticsearch/connection');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('teamgamedata', {
        firstTime: true,
        success: true
    })
});


router.post('/', function (req, res) {
    console.log("team game data body: " + JSON.stringify(req.body));


    var teamNumber = req.body.teamNumber instanceof String ? parseInt(req.body.teamNumber) : req.body.teamNumber;
    var important = req.body.important;
    var unwanted = req.body.unwanted;
    console.log("teamNumber", typeof teamNumber);
    console.log("important", typeof important);
    console.log("important[0]", typeof important[0]);
    console.log("unwanted", typeof unwanted);
    console.log("unwanted[0]", typeof unwanted[0]);

    important = [important];
    if (important === "") {
        important = [];
    } else {
        important = [parseInt(important)];
    }

    if (!(unwanted instanceof Array)) {
        if (unwanted === "") {
            unwanted = [];
        } else {
            unwanted = [parseInt(unwanted)];
        }
    }
    client.update({
        // teams/team/4590 : {}
        index: 'team-game-data',
        id: teamNumber,
        type: "team",
        body: {
            script: {
                lang: "painless",
                inline: "for(int i = 0; i < params.importantGames.length; i++) {if(!ctx._source.importantGames.contains(params.importantGames[i])){ctx._source.importantGames.add(params.importantGames[i])}}for(int i = 0; i < params.unwantedGames.length; i++) {if(!ctx._source.unwantedGames.contains(params.unwantedGames[i])){ctx._source.unwantedGames.add(params.unwantedGames[i])}}",
                params: {
                    "importantGames": important,
                    "unwantedGames": unwanted
                }
            },
            upsert: {
                "importantGames": important,
                "unwantedGames": unwanted,
                "reviewedGames": []
            }
        }
    }, function (err, resp, status) {
        console.log(resp);
        if (err) {
            console.log(err);
            res.sendStatus(500); // Internal server error
        } else {
            /// .   .   .   Insert into ES and get gameid
            res.render('teamgamedata', {
                success: 1,
                firstTime: 0
            });
        }
    });
});
module.exports = router;
