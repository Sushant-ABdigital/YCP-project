var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

//3>> Users
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", userSchema);
//Export
module.exports = User;