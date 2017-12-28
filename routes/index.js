var express = require('express');
var mongoose = require('mongoose');
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/users");
var router = express.Router({mergeParams:true});

var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

//AUTH ROUTES
//>>1. Register route
router.get("/register", function(req, res){
    res.render('register');
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    if(req.body.AdminCode === 'SecretCode'){
        newUser.isAdmin = true
    }
    User.register(newUser, req.body.password, function(err, createduser){
        if(err){
            req.flash("errormessage", err.message);
            return res.redirect('/register');
        }else{
            res.redirect("/");
        }
    });
});

//>> 2. Login routes
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res){
});

//>> 3. Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("successmessage", "Thank you! You are safely logged out!")
    res.redirect("/campgrounds");
});



module.exports = router;