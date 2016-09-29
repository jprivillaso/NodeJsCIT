var peopleService = require('../services/people');

var _ = require('lodash');

var peopleRoutes = function(app, db) {
  
  app.get('/people', function(req, res) {
    
    var queryFilters = req.query;
    
    if (!_.isEmpty(queryFilters)) {
      
      var q = queryFilters.q; 
             
      peopleService.getAllByFilters(function(peopleList){
        
        peopleList = JSON.parse(peopleList);
        db.set('peopleList', JSON.stringify(peopleList.data));
        res.send(peopleList.data);
        
      }, q);
      
    } else {
      
      peopleService.getAll(function(peopleList){
        
        peopleList = JSON.parse(peopleList);
        db.set('peopleList', JSON.stringify(peopleList.data));
        res.send(peopleList.data);
        
      }, db);
       
    }

  });
  
  app.get('/people/getCountByRole/:role', function(req, res) {
     
    var role = req.params.role; 
       
    peopleService.getCountByRole(function(count){
      // Use json because count is a number and would be interpreted
      // as a http status
      res.json(count);
    }, role, db);
    
  });
  
  app.get('/people/getCouchWithMaxCouchees', function(req, res) {
    
    peopleService.getCouchWithMaxCouchees(function(couchName){
      res.json(couchName);
    }, db); 
      
  });
  
  app.post('/people', function(req, res) {
    
    var person = req.body;
    
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
      res.json(person);
      
    });    
    
  });
  
  app.put('/people', function(req, res){
    
    var newPerson = req.body;
    
    if (_.isEmpty(newPerson)) {
      throw new Error('Person inside body is missing');
    }
    
    db.get('peopleList', function(err, peopleList) {
      
      if (_.isEmpty(peopleList)) {
        throw new Error('Error retrieving peopleList from redis');
      } 
      
      peopleList = JSON.parse(peopleList);
      
      var existentPersonIndex = _.findIndex(peopleList,  function(person){
        return person[1] === newPerson.login;
      });
      
      console.log(existentPersonIndex);
      
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
      
      res.json(peopleList);
            
    });
    
  });
  
};

module.exports = peopleRoutes;
