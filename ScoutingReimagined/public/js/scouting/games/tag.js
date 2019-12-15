function tag(spec, type) {
    console.log("Tagging spec: " + JSON.stringify(spec) + ", type: " + type);
    if (!spec) {
        return;
    }
    var query = preProcess(spec);
    var a = $(query);
    console.log(a);
    var mapping = {
        "done": "fa-check-circle badge-done",
        "important": "fa-bullseye badge-important",
        "unwanted": "fa-asterisk badge-unwanted"
    };
    a.prepend('<i class="fa fa-5x ' + mapping[type] + '"></i>');
}

function preProcess(raw) {
    var query = "";
    raw.map(function (a) {
        if (typeof a.games == "string") {
            a.games = [a.games];
        }
    });
    for (var i = 0; i < raw.length; i++) {
        for (var g = 0; g < raw[i].games.length; g++) {
            if (query !== "") {
                query += ", ";
            }
            query += "#" + raw[i].games[g] + "_" + raw[i].teamNumber;
        }
    }

    return query;
}
