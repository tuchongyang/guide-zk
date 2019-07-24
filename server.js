'use strict';

/*
 * nodejs-express-mongoose-demo
 * Copyright(c) 2018 TCY <779311998@qq.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */
require('dotenv').config()

const fs = require("fs");
const join = require("path").join;
const express = require("express");
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;
const app = express();

module.exports = app;

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

require('./config/passport')(passport)
require('./config/express')(app, passport);
require('./config/routes')(app, passport);



connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen () {
    if (app.get('env') === 'test') return;
    app.listen(port);
    console.log('Express app started on port ' + port);
}

function connect () {
    var options = { };
    var con = mongoose.connect(config.db, options)

    return mongoose.connection;
}