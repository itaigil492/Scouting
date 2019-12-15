var fight = {
    "properties": {
        "teamNumber": {
            "type": "integer"
        },
        "gameId": {
            "type": "integer"
        },
        "eventName": {
            "type": "keyword"
        },
        "startTime": {
            "type": "integer" // The amount of seconds passed since video start when the event was triggered
        },
        "endTime": {
            "type": "integer" // The amount of seconds passed since video start when the event was over
        },
        "duration": {
            "type": "integer" // Seconds
        },
        "matchPart": {
            "type": "keyword"
        },
        "enemyTeam": {
            "type": "integer" // List of all enemy team numbers involved
        },
        "alliedTeam": {
            "type": "integer" // List of all the allied team numbers involved
        },
        "initiated": { // Was the fight intentional or coerced upon the team
            "type": "boolean"
        },
        "fightReason": {
            "type": "keyword" // Can be: TODO: add fight reason codes for fight events
        },
        "status": {
            "type": "keyword" // Can be: "success" || "fail"
        },
        "failReason": {
            "type": "keyword" // Can be: TODO: add fail reason codes for fight events
        }
    }
};

module.exports = fight;
