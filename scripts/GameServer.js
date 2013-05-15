
/**
 * Module dependencies.
 */

var _ = require('underscore')
  , PlayerRepo = require('./PlayerRepo.js')
  , Api = require('./Api.js')
  , express = require('express')
  , http = require('http')
  , app = express()
  , GameRepo = require('./GameRepo.js')
  , GameTypeRepo = require('./GameTypeRepo.js')
  , server = http.createServer(app);

var GameServer = function() {
  this.games= new GameRepo();
  this.gameTypes = new GameTypeRepo();
  this.players = new PlayerRepo();  
  this.api = new Api();
  this.io = require('socket.io').listen(server);
};

GameServer.prototype.register = function(name, gametype) {
  this.gameTypes.register(name,gametype, function () {
  });
}

GameServer.prototype.listen = function() {
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


  app.get('/', function(req, res) {res.sendfile(require('path').normalize(__dirname + '/../app/index.html'));});
  app.get ('/Games', this.api.readGames.bind(this));
  app.post('/Games/:gameType', this.api.createGame.bind(this));
  app.get('/Games/:gameId', this.api.readGame.bind(this));
  app.get ('/Games/:gameId/Players', this.api.readPlayersInGame.bind(this));
  app.post('/Games/:gameId/Moves', this.api.createMoveInGame.bind(this));

  server.listen(8080, function(){
    console.log("Express server listening on port %d in %s mode",8080, app.settings.env);
  });

};

module.exports = GameServer;
