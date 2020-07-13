var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
  res.render("login", {title: 'User login'});
});

router.get('/register', function(req, res) {
  res.render("register", {title: 'User register'});
});

router.get('/home', function(req, res) {
  res.render("home", {title: 'Home'});
});

router.get('/logout', function(req, res) {
  res.redirect("/");
});

module.exports = router;
