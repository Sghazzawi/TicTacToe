var Player = require('./Player.js')
  , _ = require('underscore');

var PlayerRepo = function() {
 this.Players=[];
};

PlayerRepo.prototype.getOrAddBySessionID = function (sessionID, cb) {
  var p = _.findWhere(this.Players,{sessionID: sessionID});
  if ((p === null) || (p === undefined)){
      var player = new Player();
      player.sessionID = sessionID;
      this.Players.push(player);
      console.log("player = "+player);
      cb(player);
  } else { 
      console.log("p = "+p);
      cb(p);
  }
  
}

module.exports = PlayerRepo;
