const express = require('express');
const Promotions = require('../models/promotions');
const promoRouter = express.Router();

promoRouter.use(express.json());
promoRouter.route('/:promoId')
.get((req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
        console.log(promotion);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
})
.post((req,res,next)=>{
    res.statusCode = 403;
  res.end('POST operation not supported on /promotion/'+ req.params.promoId);
})
.put((req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId , {$set : req.body} ,{new : true})
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
        console.log(promotion);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
})
.delete((req,res,next)=>{
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
        console.log(resp);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})

})
promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
        console.log(promotions);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
})
.post((req, res, next) => {
    Promotions.create(req.body)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
        console.log(promotion);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
        console.log(resp);
    },(err)=>{
        next(err)
    }).catch((error)=>{ next(error)})
});

module.exports = promoRouter;