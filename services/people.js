var request = require('request');
var conf    = require('../config/config');
var async   = require('async');

const baseUrl = 'https://people.cit.com.br/search/json/';

var options = {
  auth: {
    user: conf.api.user,
    password: conf.api.password
  }
}

function getAll(callback) {
    
    var peoplelist = [];
    
    async.series([function(callback){
        
        options.url = baseUrl + '?q=BRASIL%20and%20Developer%20and%20BH';
        
        request(options, function(error, response, body) {
            
            peoplelist = body;
            callback(peoplelist, null);
            
        });
      
    }], callback.bind(peoplelist));
    
}

function getAllByFilters(callback, query) {
    
    var peoplelist = [];
    
    async.series([function(callback){
        
        options.url = baseUrl + '?q=' + query;
                
        request(options, function(error, response, body) {
                
            peoplelist = body;
            callback(peoplelist);
            
        });
      
    }], callback.bind(peoplelist));
    
}

module.exports = {
    getAll: getAll,
    getAllByFilters: getAllByFilters
};