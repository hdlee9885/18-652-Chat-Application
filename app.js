var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var multer = require('multer');
// mongoose as object modeling tool
var mongoose = require('mongoose');
//global.manipulate = require('./database/manipulate');
const uri = "mongodb+srv://hdlee9885:Lihaosong2@cluster0-j9rvf.mongodb.net/nodedb?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected')).catch(err => console.log(err));

//Get the default connection
var db = mongoose.connection;
// bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var userModel = require('./database/model');

var session = require('express-session');
var app = express();
app.use(session({ 
  secret: 'secret',
  cookie:{ 
      maxAge: 1000*60*30
  },
  resave: true,
  saveUninitialized: true
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { title } = require('process');

// view engine setup
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));
// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){ 
  res.locals.user = req.session.user;  // get user from session
  var err = req.session.error;  // get error message
  delete req.session.error;
  res.locals.message = "";
  if(err){
      res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login',indexRouter);
app.use('/register',indexRouter);
app.use('/home',indexRouter);
app.use("/logout",indexRouter);

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
