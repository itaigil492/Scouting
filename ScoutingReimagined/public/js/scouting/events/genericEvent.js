class GenericEvent{

    addParam(paramName, options, preemtiveFinish){
        this.addSpecialParam(paramName, options, null, preemtiveFinish);
    }

    addSpecialParam(paramName, options, extraCode, preemtiveFinish){
        this[paramName] = null;
        this.varnames.push(paramName);

        var fillList = [];
        for (var op in options){
            var thisOp = options[op];
            if (typeof thisOp === typeof []){ // Multi choose box thing
                fillList.push({
                    type: "buttonSelect",
                    value: thisOp
                })
            } else { // Single button
                fillList.push({
                    type: "button",
                    value: thisOp
                })
            }
        }
        
        var self = this;

        this.setup.push(

            function (prev_param, index) {

                if (preemtiveFinish !== null){
                    if (preemtiveFinish(prev_param)){
                        self.genericFinish(null, index + 1, self);
                        return;
                    }
                }

                if (extraCode !== null){
                    extraCode(self);
                }

                self[self.varnames[index - 1]] = prev_param;
                fillEventsDivWithObjects(fillList, function(inp) { self.setup[index + 1](inp, index + 1); });
            }

        );
    }


    removeNulls(papa){
        var toRemove = [];
        for (var k in papa){
            if (papa[k] === null){
                toRemove.push(k);
            }
        }

        for (var k in toRemove){
            console.log("Removed " + toRemove[k] + " from event " + papa.eventName);
            delete papa[toRemove[k]];
        }
    }

    genericFinish(item, index, papa){
        if (papa.setup.length !== 1){
            papa[papa.varnames[index - 1]] = item;
        }
        papa.endTime = Math.round(gameVideo.currentTime - autonomousStartTime);
        papa.garbage = null;
        papa.setup = null;
        papa.varnames = null;
        papa.removeNulls(papa);
        console.log("Event " + papa.eventName + " sent");
        sendEvent(papa.getSimpleVersion());
        initializeEvents();
    }

    constructor(name){
        this.teamNumber = teamNumber;
        this.gameId = gameId;
        this.startTime = Math.round(gameVideo.currentTime - autonomousStartTime);
        this.matchPart = (gameVideo.currentTime - autonomousStartTime) < 15 ? "autonomous" : "teleop"
        this.eventName = name;
        this.endTime = null;
        this.competition = this.competition;

        this.garbage = null,
        this.setup = [];
        this.varnames = [];
    }

    addGenericFin(){
        var self = this;

        this.setup.push(
            function (a, b) {
                self.genericFinish(a, b, self)
            }
        );
        console.log(this.setup);
    }

    getSimpleVersion(){
        var simpleVersion = {};
        for (var par in this){
            if (typeof this[par] !== typeof (function(){})){
                simpleVersion[par] = this[par];
            }
        }
        return simpleVersion;
    }

    start(){
        hideAllButtons();
        this.addGenericFin();
        this.setup[0]("", 0);
    }

}