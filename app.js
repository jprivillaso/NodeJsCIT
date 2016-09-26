var redis = require('redis');
var conf = require("./config/config");
var express = require("express");
var http = require('http');
var request = require("request");
var async = require("async");
var servicePeople = require("./services/people");

var port = 8080;
var server = http.createServer(app);

var app = express();

app.get('/people', function(req, res) {

    servicePeople.getAll(function(peoplelist){
        res.json(peoplelist); 
    });

});

app.listen(port, function(req, res) {
    console.log("Running port -> " + port);
});


var client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});

client.set('framework', 'NodeJS');

client.get('framework', function(err, reply) {
    console.log(reply);
});

client.del('framework', function(err, reply) {
    console.log(reply);
});

module.exports = app;