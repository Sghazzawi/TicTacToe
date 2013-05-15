
var GameTypeRepo = function() {
 this.GameTypes={};
};

GameTypeRepo.prototype.register = function(name, gametype, cb) {
  this.GameTypes[name] = gametype;
  cb();
}; 

GameTypeRepo.prototype.create = function (name, cb) {
  cb(new this.GameTypes[name]());
};

module.exports = GameTypeRepo;
