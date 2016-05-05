var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    User = require('../models/user.js');


router.post('/', function(req, res) {
  if(req.user){
    return res.json(req.user);
  }
   res.status(404);
  
});

router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({err: err});
    }
    passport.authenticate('local')(req, res, function () {
      console.log(req._passport);
      console.log(req.user._id);
      return res.status(200).json({status: 'Registration successful!', userId: req.user._id});
    });
  });
});

router.post('/login', function(req, res, next) {
  req.logout();
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(500).json({err: err});
    }
    if (!user) {
      return res.status(401).json({err: info});
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({err: 'Could not log in user'});
      }
      res.status(200).json({status: 'Login successful!', user: {id: user._id, name: user.username}});
    });
  })(req, res, next);
});

router.post('/status', function(req, res) {
  
  if( req.isAuthenticated())
    res.status(200).json({loged: req.isAuthenticated(), user: req.session.passport.user});
})
router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'Bye!'});
});

module.exports = router;