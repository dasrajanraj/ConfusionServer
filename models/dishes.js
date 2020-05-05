const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating :{
        type : Number,
        max : 5,
        min : 1,
        require : true,
    },
    comment : {
        type : String,
        require : true
    },
    author : {
        type: String,
        require : true
    }
},{
    timestamps : true
})



const dishSchema = new Schema({
    name : {
        type : String,
        require : true,
        unique : true
    },
    image :{
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    label : {
        type : String,
        default : ''
    },
    price : {
        type : Currency,
        min : 0
    }
    ,
    feature :{
        type : Boolean,
        default : false
    },
    description : {
        type: String,
        require : true
    },
    comments : [commentSchema]
},{
    timestamps : true
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;