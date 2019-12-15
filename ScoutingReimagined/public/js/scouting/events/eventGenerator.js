function generateEvent(generator, name, color){
    var elem = document.getElementById("scouterButtons");
    elem.innerHTML = 
    '<div class="col-sm-2">\n' +
        '<button id="' + name + '" class="btn btn-info btn-block btn-rounded hidden" style="height: 10vh; font-size: xx-large; color:' + color + '" onclick="' + generator.name + '()">' + name + '</button>\n' +
    '</div>\n' + elem.innerHTML;
}

function generateAllEvents(){
    var events = getEvents();

    for (var i in events){
        generateEvent(events[i][0], events[i][1], events[i][2]);
    }
}

function getButtonNames(){
    var events = getEvents();
    var ret = [];

    for (var i in events){
        ret.push(events[i][1]);
    }
    ret.push('comment');

    return ret;
}

function getButtonClickEvents(){
    var retVal = {};
    var index = 1;
    var events = getEvents();

    for (var elem in events){
        retVal[index] = events[elem][0];
        index += 1;
    }
    retVal[index] = comment_start; // Comments are special, so hard coded

    return retVal;
}

function getEvents(){
    var events = [];

    // -------------------------------------
    // Add your events here:
    events.push([climbGenerator, "climb", "hotpink"]);
    events.push([cycleGenerator, "cycle", "red"]);
    // -------------------------------------

    return events;
}

// --------------------------------------
// Add your generators here (as functions):

function climbGenerator(){
    climbEvent = new GenericEvent("climb");
    climbEvent.addParam("level", ["1", "2", "3"], null);
    climbEvent.addParam("status", ["Success", ["Timeout", "Mechanical Fail", "Driver Fail"]], null);
    climbEvent.start();
}

function cycleGenerator(){
    cycleEvent = new GenericEvent("cycle");
    cycleEvent.addParam("gamePiece", ["Cargo", "Hatch"], null);
    cycleEvent.addParam("pickupLocation", ["Floor", "Feeder"], null);
    cycleEvent.addSpecialParam("pickupStatus", ["Success", ["Driver Fail", "Mechanical Fail", "Interrupted"]], 
    function(self){
        self.timeTookPickup = Math.round(gameVideo.currentTime - self.startTime);
    }
    , null);
    cycleEvent.addSpecialParam("placeLocation", ["Cargo", ["Rocket Low", "Rocket Mid", "Rocket High"]], 
    function(self){
        self.placeStartTime = Math.round(gameVideo.currentTime - autonomousStartTime);
    },
    function(prev){
        return prev !== "Success";
    }
    );
    cycleEvent.addSpecialParam("placeStatus", ["Success", ["Driver Fail", "Mechanical Fail", "Interrupted"]], 
    function(self){
        self.timeTookPlace = Math.round(gameVideo.currentTime - self.placeStartTime);
    }
    , null);
    cycleEvent.start();
}
