var Game = function (){
  this.players = [];
  this.moves = {};
};

Game.prototype.addMove = function(name, func) {
  this.moves[name] = func.bind(this);
};

Game.prototype.addPlayer = function(player) {
  this.players.push(player);
};

Game.prototype.makeMove = function(type, args) {
  this.moves[type](args);
};

Game.prototype.setNextTurn = function(func) {
  this.nextTurn = func;
};


module.exports = Game;
