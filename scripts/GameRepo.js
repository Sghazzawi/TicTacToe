var Player = require('./Game.js')
  , _ = require('underscore');

var GameRepo = function() {
 this.Games=[];
};


GameRepo.prototype.save = function(game,cb) {
  this.Games.push(game);
  game._id = this.Games.indexOf(game);
  cb(game);
};  

GameRepo.prototype.getAll = function(cb) {
  cb(this.Games);
};

GameRepo.prototype.getById = function(id, cb) {
  cb(this.Games[id]);
};

module.exports = GameRepo;
