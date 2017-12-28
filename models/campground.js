var express = require('express');
var mongoose = require('mongoose');

//>>1. Campgrounds
var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }, 
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
//>>1. Models
var Campground = mongoose.model("Campground", campgroundSchema);
//Export
module.exports = Campground;
