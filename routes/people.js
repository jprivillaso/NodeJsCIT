var servicePeople = require("../services/people");
var _ = require('lodash');

var peopleRoutes = function(app) {
  
  app.get('/people', function(req, res) {
    
    var queryFilters = req.query;
    
    if (queryFilters) {
      
      var q = queryFilters.q; 
             
      servicePeople.getAllByFilters(function(peoplelist, error){
        res.send(peoplelist);
      }, q);
      
    } else {
      
      servicePeople.getAll(function(peoplelist, error){
        res.send(peoplelist);
      });
       
    }

  });
  
};

module.exports = peopleRoutes;
