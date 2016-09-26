var request = require("request");
var conf    = require("../config/config");
var async   = require("async");

var options = {
  url: 'https://people.cit.com.br/search/json/?q=BRASIL%20and%20Developer%20and%20BH',
  auth: {
    user: conf.api.user,
    password: conf.api.password
  }
}

function getAll(callback) {
    
    var peoplelist = [];
    
    async.series([function(callback){
      
        request(options, function(error, response, body) {
            peoplelist = body;
            callback(peoplelist);
        });
      
    }], callback.bind(peoplelist));
    
}

module.exports = {
    getAll: getAll
};