'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  var scope;
  var ctrl;
  var http;
  var routeparams;
  var socket;
  var $httpBackend; 
  beforeEach(module('myApp.controllers'));
  
  beforeEach (inject(function($http,$injector,$rootScope) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', '/Games/1').respond({_id: '1', board: [['e','e','e'],['e','e','e'],['e','e','e']]});
      http=$http;
      routeparams = {};
      routeparams.gameId=1;
      scope = $rootScope.$new();
      socket = {};
      socket.on = function(){};
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should make a REST call', inject(function($controller) {
    $httpBackend.expectGET('/Games/1');
    ctrl = $controller('MyCtrl1',{$scope:scope, $http:http, $routeParams:routeparams, socket:socket});
    $httpBackend.flush();
  }));


  it('should load a new board scope', inject(function($controller, $http) {
    ctrl = $controller('MyCtrl1',{$scope:scope, $routeParams:routeparams, socket:socket});
    expect(scope.clicktile).not.toBe(undefined);
//    jasmine.log(scope);
    $httpBackend.flush();
  }));

 /* it('should should have an array of length 3', inject(function() {
    expect(scope.board.length).toBe('undefined');
  }));*/

});
