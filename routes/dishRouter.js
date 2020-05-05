const express = require('express');
const Dishes = require('../models/dishes');
const dishRouter = express.Router();

dishRouter.use(express.json());

dishRouter.route('/:dishId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
        console.log(dish);
    },(err)=>next(err))
    .catch((err) => next(err));
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId ,{$set : req.body},{new : true})
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
        console.log(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next)=>{
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((resp) => {
        console.log('Dish Deleted ', resp);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
    .then((dishes) => {
        console.log('Dishes found ', dishes);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => console.log(err))
    .catch((err) => console.log(err));
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then((dish) => {
        console.log('Dish Deleted ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
});



// Comment fetching for dishes
dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if( dish != null && dish.comments.id(req.params.commentId) != null ){
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
            console.log(dish.comments.id(req.params.commentId));
        }
        else if(dish == null){
            var error = new Error("Dish Not Found in DB :" , req.params.dishId);
            error.statusCode = 404;
            next(error);
        }
        else {
            var error = new Error("Comment Not Found in DB :" , req.params.commentId);
            error.statusCode = 404;
            next(error);
        }
    },(err)=>next(err))
    .catch((err) => next(err));
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if( dish != null && dish.comments.id(req.params.commentId) != null ){
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish)=>{
                console.log(dish);
                res.statusCode = 202;
                res.setHeader("Content-Type","application/json");
                res.json(dish);
            })        
        }
        else if(dish == null){
            var error = new Error("Dish Not Found in DB :" , req.params.dishId);
            error.statusCode = 404;
            next(error);
        }
        else {
            var error = new Error("Comment Not Found in DB :" , req.params.commentId);
            error.statusCode = 404;
            next(error);
        }        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if( dish != null && dish.comments.id(req.params.commentId) != null ){
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
                console.log("Comment Deleted")
            })
        }
        else if(dish == null){
            var error = new Error("Dish Not Found in DB :" , req.params.dishId);
            error.statusCode = 404;
            next(error);
        }
        else {
            var error = new Error("Comment Not Found in DB :" , req.params.commentId);
            error.statusCode = 404;
            next(error);
        }        
    }, (err) => next(err))
    .catch((err) => next(err));
})

dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            console.log('Dish '+ req.params.dishId + " comments are ", dish.comments);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else{
            var error = new Error("Dish" + req.params.dishId + " not found");
            error.statusCode = 404;
            next(error);
        }
    }, (err) => console.log(err))
    .catch((err) => console.log(err));
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);    
            })
        }
        else{
            var error = new Error("Dish" + req.params.dishId + " not found");
            error.statusCode = 404;
            next(error);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if( dish != null){
            for(var i = dish.comments.length-1 ; i >= 0 ; i--){
                dish.comments.id(dish.comments[i]._id).remove();

            }
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
                console.log("Comment Deleted")
            })
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;