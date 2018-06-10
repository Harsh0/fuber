'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');

const app = express();

const routes = require('./routes');

app.use(express.static(path.resolve(__dirname, 'public')));

//logger added
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//register all routes
app.use('/', routes);

app.use(function(req, res, next) {
    //create 404 error
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    //skip for 404 error
    if(err.status!=404) console.log(err);
    res.locals.message = err.message||error[err.code]
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json({
        "error":res.locals.message
    });
});

module.exports = app;