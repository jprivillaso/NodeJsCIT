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
    
    var peopleList = [];
    
    async.series([function(){
        
        db.get('peopleList', function(err, peopleData) {
            
            if (err) {
                throw new Error('Error retrieving peopleList form redis');
            }
            
            peopleList = peopleData;
            callback(peopleList);
            
        });
      
    }], callback.bind(peopleList));
    
}

function getAllByFilters(callback, query) {
    
    var peopleList = [];
    
    async.series([function(){
        
        options.url = BASE_URL + '?q=' + query;
                
        request(options, function(error, response, body) {
                
            peopleList = body;
            callback(peopleList);
            
        });
      
    }], callback.bind(peopleList));
    
}

function getCountByRole (callback, role, db) {
  
    var peopleCount = null;
    
    async.series([function(){
        
        db.get('peopleList', function(err, body){
        
            if (err) {
                throw new Error('Error retrieving peopleList');
            }
            
            var peopleList = JSON.parse(body);
            console.log(peopleList);
            
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

function save(callback, person, db) {
    
    var savedPerson = null;
    
    async.series([function(){
        
        db.get('peopleList', function(err, peopleList) {
        
            if (peopleList) {
                peopleList = JSON.parse(peopleList);
            } else {
                peopleList = [];
            }
            
            peopleList.push([
                person.name || '', 
                person.login || '', 
                person.number || '', 
                person.mobileNumber || '', 
                person.role || '', 
                person.couch || '',
                person.couch || '', 
                person.location || ''
            ]);
            
            db.set('peopleList', JSON.stringify(peopleList));
            savedPerson = person;
                
        });
            
    }], callback.bind(savedPerson));
    
    
}

function update(callback, newPerson, db) {
    
    var savedPerson = null;
    
    async.series([function(){
        
        db.get('peopleList', function(err, peopleList) {
            
            if (_.isEmpty(peopleList)) {
                throw new Error('Error retrieving peopleList from redis');
            } 
            
            peopleList = JSON.parse(peopleList);
            
            var existentPersonIndex = _.findIndex(peopleList,  function(person){
                return person[1] === newPerson.login;
            });
            
            if (existentPersonIndex != -1 ) {
                
                var personToUpdate = [
                newPerson.name || '', 
                newPerson.login || '', 
                newPerson.number || '', 
                newPerson.mobileNumber || '', 
                newPerson.role || '', 
                newPerson.couch || '',
                newPerson.couch || '', 
                newPerson.location || ''
                ];
                
                peopleList[existentPersonIndex] = personToUpdate;
                db.set('peopleList', JSON.stringify(peopleList));
                
            }
            
            savedPerson = newPerson;
            
            callback(savedPerson);
            
        });
        
    }], callback.bind(savedPerson));
    
}

function deletePerson(callback, username, db) {
    
    var deletedPerson = null;
    
    async.series([function(){
        
        db.get('peopleList', function(err, peopleList){
            
            peopleList = JSON.parse(peopleList);
            
            var index = _.findIndex(peopleList, function(person){
                return person[1] === username;
            });
            
            console.log(index);
            
            if (index != -1) {
                
                deletedPerson = peopleList[index];  
                peopleList.splice(index, 1);
                db.set('peopleList', JSON.stringify(peopleList));
                 
            }
            
            callback(deletedPerson);
            
        });
        
    }], callback.bind(deletedPerson));
    
}

module.exports = {
    loadDataInDb            : loadDataInDb,
    getAll                  : getAll,
    getAllByFilters         : getAllByFilters,
    getCountByRole          : getCountByRole,
    getCouchWithMaxCouchees : getCouchWithMaxCouchees,
    update                  : update,
    save                    : save,
    delete                  : deletePerson
};