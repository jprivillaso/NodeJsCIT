var redis   = require('redis');
var express = require("express");
var http    = require('http');
var request = require("request");
var async   = require("async");
var consign = require("consign");

var config = require("./config/config");

var app    = express();
var db     = redis.createClient();
var server = http.createServer(app);

consign(config.consign)
  .include('routes')
  .into(app);

app.get('/', function(req, res) {
    res.json('Hello Api');
});

app.listen(config.server.port, function(req, res) {
    console.log("Running port -> " + config.server.port);
});

module.exports = app;