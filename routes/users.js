var express = require('express');
var router = express.Router();
var Users = require('../models/users');

router.use(express.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req, res , next)=>{
  Users.findOne({username : req.body.username})
  .then((user)=>{
    if(user != null){
      var err= new Error("User "+ req.body.username + " already exists");
      err.statusCode= 401;
      next(err);
    }else{
      return Users.create({username: req.body.username, password : req.body.password})
    }
  })
  .then((user)=>{
      res.statusCode = 200
      res.setHeader("Content-Type" , "application/text");
      res.end("User Regestered Successfully");
      console.log(user);
  },(err)=>{next(err)})
  .catch((error)=>{
      next(error);
  })
});

router.post('/login' , (req,res, next)=>{
  if( !req.session.user){
    var authHead = req.headers.authorization;
    if( !authHead ){
      var err = new Error("You are not authenticated");
      res.setHeader("WWW-Authenticate" , "Basic");
      err.status = 401;
      next(err);
        return;
    }
    var auth = new Buffer.from(authHead.split(" ")[1] , "base64").toString().split(":");
    var username = auth[0];
    var password = auth[1];

    Users.findOne({username : username})
    .then((user)=>{
      if(user == null ){
        var err = new Error("Username " + req.body.username + " not found");
        err.statusCode = 403;
        next(err);
      }
      else if( user.password != password){
        var err = new Error("Password entered incorrect");
        err.statusCode = 403;
        next(err);
      }
      else if(user.username === username  && password === user.password){
        req.session.user = 'authenticated';
        res.statusCode= 200;
        res.setHeader("Content-Type" , " application/text");
        res.end("You are Authenticated");
      }
    })
  }
  else{
    res.statusCode= 200;
    res.setHeader("Content-Type" , " application/text");
    res.end("You are already Authenticated");
  } 
})

router.post('/logout', (req ,res , next)=>{
  res.clearCookie('session-id');
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
