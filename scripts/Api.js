
/**
 * Module dependencies.
 */

var _ = require('underscore')

var Api = function () {
};

Api.prototype.readGames = function(req, res) {
  this.games.getAll(function (games) {
    res.json(games);
  });
};


Api.prototype.createGame = function(req, res) {
  this.players.getOrAddBySessionID(req.sessionID, function(player){
    this.gameTypes.create(req.param('gameType'), function (game) {
      game.setSckts(this.io);
      game.addPlayer(player);
      game.setCurrentTurn(player);
      this.games.save(game, function(game){
        res.json(game);
      });
    }.bind(this));
  }.bind(this));
};

Api.prototype.readGame = function(req, res) {
  var player = this.players.getOrAddBySessionID(req.sessionID, function(player){
      this.games.getById(req.param('gameId'), function (game) {
        var found = _.findWhere(game.players,{sessionID: player.sessionID});
        if ((found === null) || (found === undefined)){
          if (game.players.length < game.maxPlayers) {
            game.addPlayer(player);
            this.io.sockets.emit("updatePlayers",game.players);
            game.emit('join', game.players);
          }
        }
        res.json(game);
      }.bind(this));
  }.bind(this));
};

Api.prototype.readPlayersInGame = function (req, res) {
  res.json(this.games[req.param('gameId')].users);
}; 

Api.prototype.createMoveInGame = function (req, res) {
  this.games.getById(req.param('gameId'), function (game) {
    var args = req.body.args;
    args.player = _.findWhere(game.players, {sessionID: req.sessionID});
    if (( args.player !== null) && (args.player !== undefined)){
      if (game.moves[req.body.type].isValid(game.validMoves(), req.body)){
        game.moves.emit(req.body.type , req.body.args);
      } else {
      console.log('invalid move');
      }
    }
    res.json(game);  
  });
};

module.exports = Api;
