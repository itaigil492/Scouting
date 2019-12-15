var shooting = {
    "properties": {
        "teamNumber": {
            "type": "integer"
        },
        "gameId": {
            "type": "integer"
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
            "type": "keyword" // Can be: "low" || "high"
        },
        "status": {
            "type": "keyword" // Can be: "success" || "fail"
        },
        "failReason": {
            "type": "keyword" // Can be: TODO: add fail reasons codes for shooting events
        }
    }
};

module.exports = shooting;
