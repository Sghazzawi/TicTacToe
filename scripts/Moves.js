var util = require("util");
var events = require("events");


var Moves = function(){
  events.EventEmitter.call(this);
}

util.inherits(Moves, events.EventEmitter);

module.exports = Moves;
