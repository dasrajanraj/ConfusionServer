var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var fileStore = require('session-file-store')(session);

var url = "mongodb://127.0.0.1/confusion";

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promotionRouter');
var Dishes = require('./models/dishes');

var app = express();
var connect= mongoose.connect(url);

connect.then((db)=>{
  console.log("Connection Successful");
}, (err) =>{console.log("Error in connection")});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'session-id',
  secret : '1212-1231-2423-1213',
  saveUninitialized : false,
  resave : false,
  store : new fileStore()
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req ,res, next){
  console.log(req.session);
  if( !req.session.user){
    var err = new Error("You are not authenticated");
    err.status = 403;
    return next(err);
  } 
  else{
    if( req.session.user === 'authenticated'){
      next();
    }else{
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }
  }
}
app.use(auth);
app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);

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

module.exports = app;
