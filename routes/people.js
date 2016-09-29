var peopleService = require('../services/people');

var _ = require('lodash');

var peopleRoutes = function(app, db) {
  
  app.get('/people', function(req, res) {
    
    var queryFilters = req.query;
    
    if (!_.isEmpty(queryFilters)) {
      
      var q = queryFilters.q; 
             
      peopleService.getAllByFilters(function(peopleList){
        res.send(peopleList);
      }, q);
      
    } else {
      
      peopleService.getAll(function(peopleList){
        res.send(peopleList);
      }, db);
       
    }

  });
  
  app.get('/people/countByRole/:role', function(req, res) {
     
    var role = req.params.role; 
       
    peopleService.getCountByRole(function(count){
      // Use json because count is a number and would be interpreted
      // as a http status
      res.json(count);
    }, role, db);
    
  });
  
  app.get('/people/couchWithMaxCouchees', function(req, res) {
    
    peopleService.getCouchWithMaxCouchees(function(couchName){
      res.json(couchName);
    }, db); 
      
  });
  
  app.post('/people', function(req, res) {
    
    var person = req.body;
    
    peopleService.save(function(savedPerson){
      res.json(savedPerson);
    }, person, db);
    
  });
  
  app.put('/people', function(req, res){
    
    var newPerson = req.body;
    
    if (_.isEmpty(newPerson)) {
      throw new Error('Person inside body is missing');
    }
  
    peopleService.update(function(savedPerson){
      res.json(savedPerson);
    }, newPerson, db);
    
  });
  
  //login is acting as the identifier
  app.delete('/people/:username', function(req, res){
    
    var username = req.params.username;
    
    peopleService.delete(function(deletedPerson){
      res.json(deletedPerson);
    }, username, db);
    
  });
  
};

module.exports = peopleRoutes;
