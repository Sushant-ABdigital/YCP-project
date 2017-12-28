var express = require('express');
var mongoose = require('mongoose');
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var router = express.Router({
    mergeParams: true
});

//All the middleware will go here
var middlewareObj = {};
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("errormessage", "You need to login!");
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundedcampground) {
            if (err) {
                req.flash("error", "DB checking failed!");
                res.redirect("back");
            } else {
                if (foundedcampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You do not own the campground hence access denied!")
                    res.redirect("back");
                }   
            }
        });
    } else {
        req.flash("error", "You are not logged in, Please log in to continue!")
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundedcomment) {
            if (err) {
                console.log(err)
            } else {
                if (foundedcomment.cmtauthor.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                    console.log("you dont own the comment!");
                }
            }
        });
    } else {
        res.redirect("/login");
    }
};

module.exports = middlewareObj;