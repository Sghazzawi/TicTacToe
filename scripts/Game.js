var Moves = require('./Moves.js')
  , _ = require('underscore');
var util = require("util");
var events = require("events");

var Game = function (){
  events.EventEmitter.call(this);
  this.players = [];
  this.moves = new Moves();
  this.advanceTurn = function () {};
  this.terminalState = function() {return null;};
  this.minPlayers = 0;
  this.maxPlayers = 0;
  this.__defineGetter__('validmoves' ,function () {return this.validMoves();});
  this.__defineGetter__('currentturn' ,function () {return  this.getCurrentTurn();});
};

util.inherits(Game, events.EventEmitter);

Game.prototype.setSckts = function(skts){
  this.sckts = skts.sockets;
};
 
Game.prototype.setCurrentTurn = function(player) {
  this.currentTurn = player;
};

Game.prototype.getCurrentTurn = function () {
  return this.currentTurn;
};

Game.prototype.addMove = function(name, func) {
  this.moves[name] = {};
  this.moves[name].isValid = function (validmoves, request) {
    return !(this.terminalState()) && _.some(validmoves,function (move) {
        var isvalid = move.type === request.type;
        for (d in request.args) {
         if (d !== 'player'){
          isvalid = isvalid && request.args[d] == move.args[d];
         } else {
          isvalid = isvalid && move.args[d].sessionID == request.args[d].sessionID;
         }
        };
        return isvalid;
      });  
    
  }.bind(this);
    z=func.bind(this);
    var move = function(data) { 
            z(data); 
            this.sckts.emit('moveComplete',this);
        }.bind(this);
    this.moves.on(name, move);
};

Game.prototype.addPlayer = function(player) {
  this.players.push(player);
  
};

Game.prototype.makeMove = function(moveType, moveArgs) {
  this.moves[moveType](moveArgs);
};

Game.prototype.setNextTurn = function(func) {
  this.advanceTurn = func.bind(this);
};

Game.prototype.setValidMoves = function(func) {
  this.validMoves = func.bind(this);
//  this.validMoves = func;
};

Game.prototype.nextTurn = function (func) {
  var tstate = this.terminalState();
  if ((tstate === null) || (tstate === undefined)){
    this.advanceTurn();
  } else {
    this.sckts.emit('terminal', this.terminalState());
    this.emit('terminal', this.terminalState());
  }
};

Game.prototype.toJSON = function() {
  obj = _.clone(this); 
  delete obj.sckts;
  return obj
}
module.exports = Game;
