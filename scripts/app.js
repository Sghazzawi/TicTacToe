
/**
 * Module dependencies.
 */

var express = require("express")
  , app = express()
  , http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// Configuration

app.configure(function(){
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

app.get('/', function(req, res) {res.sendfile(require('path').normalize(__dirname + '/../app/index.html'));});

app.post('/Games', function(req, res) {
  var gameState = {};
  gameState.moves = {}
  gameState.moves.clicktile = function(data) {
    this.board[data.row][data.col] = 'x';
  }.bind(gameState);

  gameState.board = [['e','e','e'],
                     ['e','e','e'],
                     ['e','e','e']];

  games.push(gameState);
  gameState._id = games.indexOf(gameState);
  res.json(gameState); 
});

app.get('/Games/:gameId', function(req, res) {
  if (req.param('gameId') < games.length) {
    res.json(games[req.param('gameId')]);
  }
});

app.post('/Games/:gameId/Moves', function (req, res) {
  games[req.param('gameId')].moves[req.body.type](req.body.args);
  io.sockets.emit("update",games[req.param('gameId')].board);
  res.json(games[req.param('gameId')]);  
});
server.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode",8080, app.settings.env);
});
