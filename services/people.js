'use strict';

var request = require('request');
var conf    = require('../config/config');
var async   = require('async');
var _       = require('lodash');

var baseService = require('./baseService');
const BASE_URL  = baseService.BASE_URL;
var options     = baseService.OPTIONS;

const COUNTRIES = '?q=BRASIL OR USA OR JAPAN OR CHINA OR ENGLAND';

function loadDataInDb(db) {
    
    var peoplelist = [];
    
    options.url = BASE_URL + COUNTRIES;
    
    request(options, function(error, response, body) {
        
        if (error) {
            throw new Error('Unable to get data from PEOPLE API');
        }
        
        var peopleList = JSON.parse(body);
        db.set('peopleList', JSON.stringify(peopleList.data));
        
    });
      
}

function getAll(callback, db) {
    
    var peoplelist = [];
    
    async.series([function(){
        
        db.get('peopleList', function(err, peopleData) {
            
            if (err) {
                throw new Error('Error retrieving peopleList form redis');
            }
            
            peopleList = JSON.parse(peopleData);
            callback(peopleList);
            
        });
      
    }], callback.bind(peoplelist));
    
}

function getAllByFilters(callback, query) {
    
    var peoplelist = [];
    
    async.series([function(){
        
        options.url = BASE_URL + '?q=' + query;
                
        request(options, function(error, response, body) {
                
            peoplelist = body;
            callback(peoplelist);
            
        });
      
    }], callback.bind(peoplelist));
    
}

function getCountByRole (callback, role, db) {
  
    var peopleCount = null;
    
    async.series([function(){
        
        db.get('peopleList', function(err, body){
        
            if (err) {
                throw new Error('Error retrieving peopleList');
            }
            
            var peopleList = JSON.parse(body);
            
            peopleList = _.filter(peopleList, function(person) {
                return person[4].toLowerCase() === role.toLowerCase();
            });
            
            peopleCount = peopleList.length;
            callback(peopleCount);
            
        });
        
    }], callback.bind(peopleCount));
  
}

function getCouchWithMaxCouchees (callback, db) {
    
  var peopleCount = null;
    
  async.series([function(){
      
    db.get('peopleList', function(err, peopleData) {
        
        var peopleList = JSON.parse(peopleData);
        
        var peopleOrderedByCouch = _.omit(_.groupBy(peopleList, function(a) {return a[5];}), '');
        var maxCouchCount = 0;
        var couchName = '';
        
        for (var couch in peopleOrderedByCouch) {
            if (peopleOrderedByCouch.hasOwnProperty(couch)) {
                
                if (peopleOrderedByCouch[couch].length > maxCouchCount) {
                    couchName = couch;
                    maxCouchCount = peopleOrderedByCouch[couch].length;
                }
                
            }
        } 
        
        callback({couchName: couchName, maxCouchCount: maxCouchCount});
        
    });
    
  }], callback.bind(peopleCount));
    
}

module.exports = {
    loadDataInDb            : loadDataInDb,
    getAll                  : getAll,
    getAllByFilters         : getAllByFilters,
    getCountByRole          : getCountByRole,
    getCouchWithMaxCouchees : getCouchWithMaxCouchees
};