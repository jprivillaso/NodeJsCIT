var servicePeople = require("../services/people");

var peopleRoutes = function(app) {
  
  app.get('/people', function(req, res) {

    servicePeople.getAll(function(peoplelist){
      res.json(peoplelist); 
    });

  });
  
};

module.exports = peopleRoutes;
