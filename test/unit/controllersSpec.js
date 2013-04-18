'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('myApp.controllers'));


  it('should load a new board scope', inject(function() {
    //spec body
    var http={};
    http.get= function () { return {_id:1, board:[['e','e','e'],
                                                 ['e','e','e'],
                                                 ['e','e','e']]
                                                 };
    };
    
    var routeparams = {};
    routeparams.gameId=1;
    var scope = {};
    ctrl = new MyCtrl1(scope, http, routeparams);
    expect(scope.board.length).toBe(3);

  
  }));

  it('should ....', inject(function() {
    //spec body
  }));
});
