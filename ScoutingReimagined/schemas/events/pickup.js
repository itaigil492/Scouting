var pickup = {
    "properties": {
        "teamNumber": {
            "type": "integer"
        },
        "gameId": {
            "type": "integer"
        },
        "type": {
            "type": "keyword" // can be: "ball" || "gear"
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
        "location": {
            "type": "keyword" // Can be: "feeder" || "floor"
        },
        "status": {
            "type": "keyword" // Can be: "success" || "fail"
        },
        "failReason": {
            "type": "keyword" // Can be: TODO: add fail reason codes for ballPickup events
        },
        "competition": {
            "type": "keyword"
        }
    }
};

module.exports = pickup;
