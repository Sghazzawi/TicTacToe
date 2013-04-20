
/**
 * Module dependencies.
 */

var express = require("express")
  , app = express()
  , http = require('http')
  , _ = require('underscore')
  , Game = require('./Game.js')
  , Player = require('./Player.js')
  , PlayerRepo = require('./PlayerRepo.js');

var server = http.createServer(app);
var io = require('socket.io').listen(server);

// Configuration

app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat"}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/../app'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

var games=[];
var players = new PlayerRepo();
app.get('/', function(req, res) {res.sendfile(require('path').normalize(__dirname + '/../app/index.html'));});

app.get ('/Games', function(req, res) {
  res.json(games);
});

app.post('/Games', function(req, res) {
  var player = players.getOrAddBySessionID(req.sessionID, function(player){
    var game = new Game();
    game.addPlayer(player);
    game.addMove('clicktile', function(data) {
      this.board[data.row][data.col] = 'x';
    });
    game.board = [['e','e','e'],
                  ['e','e','e'],
                  ['e','e','e']];
    games.push(game);
    game._id = games.indexOf(game);
    res.json(game);
  });
});

app.get('/Games/:gameId', function(req, res) {
  var player = players.getOrAddBySessionID(req.sessionID, function(player){
    if (req.param('gameId') < games.length) {
        var game = games[req.param('gameId')];
        var found = _.findWhere(game.players,{sessionID: player.sessionID});

      if ((found === null)||(found === undefined)){
        game.addPlayer(player);
      }

      res.json(game);
    }
  });
});

app.get ('/Games/:gameId/Players', function (req, res) {
  res.json(games[req.param('gameId')].users);
}); 

app.post('/Games/:gameId/Moves', function (req, res) {
  games[req.param('gameId')].makeMove(req.body.type , req.body.args);
  io.sockets.emit("update",games[req.param('gameId')].board);
  res.json(games[req.param('gameId')]);  
});

server.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode",8080, app.settings.env);
});
