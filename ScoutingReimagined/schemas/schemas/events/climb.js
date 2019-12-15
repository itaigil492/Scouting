var climb = {
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
        "status": {
            "type": "keyword" // Can be: "success" || "fail"
        },
        "failReason": {
            "type": "keyword" // Can be: TODO: add fail reason codes for climb events
        }
    }
};

module.exports = climb;