var redis         = require('redis');
var express       = require('express');
var http          = require('http');
var request       = require('request');
var async         = require('async');
var consign       = require('consign');
var bodyParser    = require('body-parser');
var peopleService = require('./services/people');

var config = require('./config/config');

var app    = express();
var db     = redis.createClient();
var server = http.createServer(app);

app.use(bodyParser.urlencoded(config.bodyParser));
app.use(bodyParser.json());

consign(config.consign)
  .include('routes')
  .into(app, db);

app.get('/', function(req, res) {
    res.json('Hello Api');
});

app.listen(config.server.port, function(req, res) {
    console.log('Running port -> ' + config.server.port);
});

peopleService.loadDataInDb(db);

module.exports = app;