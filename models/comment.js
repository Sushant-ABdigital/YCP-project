var express = require('express');
var mongoose = require('mongoose');

//>>2. Comments
var commentsSchema = mongoose.Schema({
    cmtdescription: String,
    cmtauthor: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
//>>2. Models
var Comment = mongoose.model("Comment", commentsSchema);

//Export
module.exports = Comment;