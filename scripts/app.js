
/**
 * Module dependencies.
 */

var express = require("express")
  , app = express()
  , util = require('util')
  , GameServer = require('./GameServer.js')
  , Game = require ('./Game.js');

  var TicTacToe = function (){
    Game.call(this);
    this.maxPlayers = 2;
    this.terminalState = function () {
       this.threeInARow = function (a, b, c) {
         if (a == b && b == c && c !=='e') {
           console.log('returning true');
           console.log(c);
           return true;
         }
           return false;
       }
       if (this.threeInARow(this.board[0][0], this.board[0][1], this.board[0][2])){
         return {status:'winner', player: this.board[0][0]};
       }
       if (this.threeInARow(this.board[1][0], this.board[1][1], this.board[1][2])){
         return {status:'winner', player: this.board[1][0]};
       }
       if (this.threeInARow(this.board[2][0], this.board[2][1], this.board[2][2])){
         return {status:'winner', player: this.board[2][0]};
       }
       if (this.threeInARow(this.board[0][0], this.board[1][0], this.board[2][0])){
         return {status:'winner', player: this.board[0][0]};
       }
       if (this.threeInARow(this.board[0][1], this.board[1][1], this.board[2][1])){
         return {status:'winner', player: this.board[0][1]};
       }
       if (this.threeInARow(this.board[0][2], this.board[1][2], this.board[2][2])){
         return {status:'winner', player: this.board[0][2]};
       }
       if (this.threeInARow(this.board[0][0], this.board[1][1], this.board[2][2])){
         return {status:'winner', player: this.board[0][0]};
       }
       if (this.threeInARow(this.board[2][0], this.board[1][1], this.board[0][2])){
         return {status:'winner', player: this.board[0][2]};
       }
       return null;
    }
    this.board = [['e','e','e'],
                  ['e','e','e'],
                  ['e','e','e']];

    this.addMove('clicktile', function (data){
      this.board[data.row][data.col] = data.player.sessionID;
      this.nextTurn();
    });
    
    this.setNextTurn(function() {
      var nextPlayerIndex = (this.players.indexOf(this.currentTurn)+1)%(this.players.length);
      this.currentTurn = this.players[nextPlayerIndex];
    });

    this.setValidMoves(function() {
      var validmoves = [];
      for (var i = 0;i < this.board.length;i++){
        for (var j = 0; j < this.board[i].length; j++){
          if (this.board[i][j] === 'e'){
            validmoves.push({type:'clicktile',
                             args:{
                                   player:this.currentturn, 
                                   row:i,
                                   col:j
                             }
                            });
          }
        }
      }
      return validmoves;
    });
  };
  
  util.inherits(TicTacToe, Game);
//var game = new Game();

var gameServer = new GameServer(app);
gameServer.listen();
gameServer.register('tictactoe',TicTacToe);



