/** Imports */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authRouter = require('./routes/auth');
const screenRouter = require('./routes/screen');
const regRouter = require('./routes/reg')

/** Start our Express App */
// In the "Imports" section above, we grabbed the main Express module from the package we installed
// This module is a function, which we then run on the second line (see below) to create our app variable here:
const app = express();

/** View */
// Set up our view engine
// This is temporary until we get React going
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/** Middleware */
// Set up middleware functions used on all our route requests in this order
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** Routes */
app.use('/auth', authRouter);     // Authentication route
app.use('/reg', regRouter);       // Registration route
app.use('/screen', screenRouter); // Screening route

/** Error Handling */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/** Export */
// Export this application for use in the entry file "./bin/www"
module.exports = app;
