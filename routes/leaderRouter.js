const express = require('express');
const Leaders = require('../models/leaders');

const leaderRouter = express.Router();
leaderRouter.use(express.json());

leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
        console.log(leader);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
})
.post((req,res,next)=>{
    res.statusCode = 403;
  res.end('POST operation not supported on /promotion/'+ req.params.leaderId);
})
.put((req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId , {$set : req.body} ,{new : true})
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
        console.log(leader);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
})
.delete((req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
        console.log(resp);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})

})
leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leaders);
        console.log(leaders);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
})
.post((req, res, next) => {
    Leaders.create(req.body)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
        console.log(leader);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Leaders');
})
.delete((req, res, next) => {
    Leaders.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
        console.log(resp);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
});


module.exports = leaderRouter;