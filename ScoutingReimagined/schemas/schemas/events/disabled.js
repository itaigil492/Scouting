var disabled = {
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
        "reason": {
            "type": "keyword" // Can be: TODO: add disabled reason codes for disabled events
        },
        "recovered": {
            "type": "boolean"
        }
    }
};

module.exports = disabled;
