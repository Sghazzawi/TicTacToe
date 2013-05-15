'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope','$http','$routeParams','socket', function($scope, $http, $routeParams, socket) {
    socket.on("moveComplete", function (data) {
       $scope.board = data.board;
    });
    

    socket.on("updatePlayers", function (data) {
       $scope.players = data;
    });

    socket.on("terminal", function (data) {
       alert(data);
    });

    $http.get('/Games/' + $routeParams.gameId).success(function(data) {
      $scope.board = data.board;
      $scope.players = data.players;
    });

    $scope.clicktile = function (row,col) {
      var move = {};
      move.type='clicktile';
      move.args = {};
      move.args.row = row;
      move.args.col = col;
      $http.post('/Games/' + $routeParams.gameId + '/Moves/',move).success(function(data) {
      });
    };
  }])
  .controller('CreateOrJoinCtrl', ['$scope','$location','$http',function($scope, $location, $http) {
    $http.get('/Games').success(function(data) {
      $scope.exisgames = data;
      console.log ($scope.exisgames);
    });
    $scope.createGame = function() {
      $http.post('/Games/tictactoe',{}).success(function(data) {
        $location.path('/view1/'+data._id);
      });
    } 


  }])
  .controller('MyCtrl2', [function() {
  
  }]);
