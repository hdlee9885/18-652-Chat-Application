var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('Users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Chat Room' });
});

router.get('/login', function(req, res) {
  console.log(res);
  res.render('login', {title: 'User login'});
});
router.post('/login', function(req,res) {
  var username = req.body.uname; // get username
  var password = req.body.userpwd; // get user password
  user.findOne({name:username},function(error, userinfo){ // find user in database
    if (error) { // if error, return code 500
      res.sendStatus(500);
      console.log(error);
      return;
    } else if (!userinfo) { // if not found, return no such user
      res.sendStatus(404);
      req.session.error = 'cannot find user';
      return;
    } else {
      if (req.body.userpwd != userinfo.password){ // if found user but pwd not matach
        res.sendStatus(404);
        req.session.error = 'password does not match, check your username or password';
        return;
      } else { // found and match
        req.session.user = userinfo; // session has current user
        userGoOnline(username);
        res.sendStatus(200);
      }
    }
  });
});

function userGoOnline(userName) {
  var user = mongoose.model('Users');
  user.update({name:userName},{$set: {status: 'online'}},function(err,doc){ 
		if(err){ 
			console.log(err);
		}else{ 
			console.log(userName+ " is online");
		}
	});
}

router.get('/register', function(req, res) {
  console.log(res);
  res.render('register', {title: 'Registration'});
});
router.post('/register',function(req,res){
  // var user = global.manipulate.getModel('user'); // get user model
  var username = req.body.uname; // get username
  var userpassword = req.body.userpwd; // get user password
  console.log(username);
  console.log(userpassword);
  user.findOne({name:username}, function(error, userinfo){ // find user in database
    if (error) {
      res.sendStatus(500);
      req.session.error("Some error occurs");
      console.log(error);
      return;
    } else if (userinfo) { // user already exists
      res.sendStatus(500);
      console.log("User already exists");
      req.session.error = 'User already exists!'
      return;
    } else { // create an user model
      user.create({
        name: username,
        password: userpassword
        }, function(err, userinfo){
          if (err) {
            res.sendStatus(500);
            console.log(err);
            return;
          } else {
            console.log("User created!");
            req.session.error = 'User created successfully!';
            //res.redirect("/login");
            res.sendStatus(200);
            return;
          }
        });
    }
  })
});

router.get('/home', function(req, res) {
  if (!req.session.user) { // check if user is logged in or not
    req.session.user = 'Please login first';
    res.redirect("/login"); // not logged in, redirect to login page
    return;
  }
  res.render('home', {title: 'Home'}); // logged in, stay at home
});

router.get('/logout', function(req, res) { // if arrived at logout
  req.session.user = null; // clear user
  res.session.error = null; // clear error
  userGoOffline(name);
  res.redirect("/"); // redirect to zero state page
});

function userGoOffline(userName) {
  var user = mongoose.model('Users');
  user.update({name:userName},{$set: {status: 'offline'}},function(err,doc){ 
		if(err){ 
			console.log(err);
		}else{ 
			console.log(userName+ " is offline");
		}
	});
}

module.exports = router;
