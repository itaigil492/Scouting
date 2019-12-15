var schemasDir = __dirname + "/../../schemas"

function setup() {
    var client = require('./connection');
    indexGames(client);
    indexEvents(client);
    indexTeamGameData(client);

}

/**
 * Indexes 'events' and uses @function mapEvents to map all event types
 * @param  {ElasticsearchConnection} client connection to the elasticsearch instance
 */
function indexEvents(client) {
    client.indices.exists({
        index: 'events'
    }, function (err, exists) {
        if (!exists) {
            client.indices.create({
                index: 'events'
            }, function (err, res) {
                console.log("err", err);
                console.log("res", res);
                if (!err) {
                    // Push mappings
                    mapEvents(client);
                }
            });
        } else {
            mapEvents(client);
        }
    });
}

/**
 * Indexes 'games' and uses @function mapGames to map the type game
 * @param  {ElasticsearchConnection} client connection to the elasticsearch instance
 */
function indexGames(client) {
    client.indices.exists({
        index: 'games'
    }, function (err, exists) {
        if (!exists) {
            client.indices.create({
                index: 'games'
            }, function (err, res) {
                console.log("err", err);
                console.log("res", res);
                if (!err) {
                    // Push mappings
                    mapGames(client);
                }
            });
        } else {
            mapGames(client);
        }

    });
}


/**
 * Maps the type game to the index games using schema defined in @file schemas/games.js
 * @param  {ElasticsearchConnection} client connection to the elasticsearch instance
 */
function mapGames(client) {
    var game = require(schemasDir + '/game');
    client.indices.putMapping({
        index: "games",
        type: "_default_",
        body: game
    }, function (err, res) {
        console.log("err: ", err);
        console.log("res: ", res);
    });
}

/**
 * Maps every event type (defined in @file schemas/events/*.js) in the index events
 * @param  {ElasticsearchConnection} client connection to the elasticsearch instance
 */
function mapEvents(client) {
    //	TODO: Check if inserting the require expression inside typeToMapping is possible
    var pickup = require(schemasDir + '/events/pickup');
    var climb = require(schemasDir + '/events/climb');
    var disabled = require(schemasDir + '/events/disabled');
    var fight = require(schemasDir + '/events/fight');
    var gearPlace = require(schemasDir + '/events/gearPlace');
    var shooting = require(schemasDir + '/events/shooting');
    var comment = require(schemasDir + '/events/comment');

    /**
     * Maps the type name to it's mapping
     * @type {Dictionary}
     */
    var typeToMapping = {
        "climb": climb,
        "disabled": disabled,
        "fight": fight,
        "pickup": pickup,
        "gearPlace": gearPlace,
        "shooting": shooting,
        "comment": comment
    };

    for (var type in typeToMapping) {
        client.indices.putMapping({
            index: "events",
            type: type,
            body: typeToMapping[type]
        }, function (err, res) {
            console.log("err: ", err);
            console.log("res: ", res);
        });
    }
}


function indexTeamGameData(client) {
    client.indices.exists({
        index: 'team-game-data'
    }, function (err, exists) {
        if (!exists) {
            client.indices.create({
                index: 'team-game-data'
            }, function (err, res) {
                console.log("err", err);
                console.log("res", res);
                if (!err) {
                    // Push mappings
                    mapTeamGameData(client);
                }
            });
        } else {
            mapTeamGameData(client);
        }

    });
}

function mapTeamGameData(client) {
    var teamGameDataMapping = require(schemasDir + '/teamGameData');
    console.log("Mapping team game data!!!");
    console.log(teamGameDataMapping);
    client.indices.putMapping({
        index: "team-game-data",
        type: "_default_",
        body: teamGameDataMapping
    }, function (err, res) {
        console.log("err: ", err);
        console.log("res: ", res);
    });
}

module.exports = {
    setup: setup
};
