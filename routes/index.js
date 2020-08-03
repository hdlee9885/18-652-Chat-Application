var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
  res.render('login', {title: 'User login'});
}).post(function(req,res) {
  var user = global.manipulate.getModel('user'); // get user model
  var username = req.body.uname; // get username
  var password = req.body.userpwd; // get user password
  user.findOne({name:username, pwd:password},function(error, userinfo){ // find user in database
    if (err) { // if error, return code 500
      res.send(500);
      console.log(error);
    } else if (!userinfo) { // if not found, return no such user
      res.send(404);
      req.session.error = 'cannot find user';
    } else {
      if (req.body.userpwd != userinfo.password){ // if found user but pwd not matach
        res.send(404);
        req.session.error = 'password does not match, check your username or password';
      } else { // found and match
        req.session.user = userinfo; // session has current user
        res.send(200);
        res.redirect("/home");
      }
    }
  });
});

router.get('/register', function(req, res) {
  res.render('register', {title: 'Registration'});
}).post(function(req,res){
  var user = global.manipulate.getModel('user'); // get user model
  var username = req.body.uname; // get username
  var userpassword = req.body.userpwd; // get user password
  console.log(username);
  console.log(userpassword);
  user.findOne({name:username}, function(error, userinfo){ // find user in database
    if (error) {
      res.send(500);
      req.session.error("Some error occurs");
      console.log(error);
    } else if (userinfo) { // user already exists
      res.send(500);
      req.session.error = 'User exists!'
    } else { // create an user model
      user.create({
        name: username,
        password: userpassword
        }, function(err, userinfo){
          if (err) {
            res.send(500);
            console.log(err);
          } else {
            user.save(function(error) {
              console.log(user);
              if(error) {
                throw error;
              }
            });
            console.log("User created!");
            req.session.error = 'User created successfully!';
            res.send(200);
            res.redirect("/login");
          }
        });
    }
  })
});

router.get('/home', function(req, res) {
  if (!req.session.user) { // check if user is logged in or not
    req.session.user = 'Please login first';
    res.redirect("/login"); // not logged in, redirect to login page
  }
  res.render('home', {title: 'Home'}); // logged in, stay at home
});

router.get('/logout', function(req, res) { // if arrived at logout
  req.session.user = null; // clear user
  res.session.error = null; // clear error
  res.redirect("/"); // redirect to zero state page
});

module.exports = router;
