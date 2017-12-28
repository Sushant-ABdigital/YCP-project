var express = require('express');
var mongoose = require('mongoose');
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var router = express.Router({
    mergeParams: true
});
var middlewareObj = require("../middleware");

//******************
//Comment section
//******************

//1. Addition of Comment

//To add the comment find the right campground and then insert the comment
router.get("/campgrounds/:id/comment/new", middlewareObj.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundedcampground) {
        if (err) {
            req.flash("error", "Something went wrong :(");
            console.log(err);
        } else {
            res.render('../views/comment/newcomment', {
                foundedcampground: foundedcampground
            });
        }
    });
});

//handling of post route to insert the comment
router.post("/campgrounds/:id/comment/new",middlewareObj.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundedcampground) {
        if (err) {
            req.flash("errormessage", "Something went wrong :(");
            console.log(err)
        } else {
            var commentdata = req.body.cmt;
            var commentinsertion = {
                cmtdescription: commentdata.description
            }
            Comment.create(commentinsertion, function (err, insertedcomment) {
                if (err) {
                    console.log(err);
                } else {
                    insertedcomment.cmtauthor.id = req.user._id;
                    insertedcomment.cmtauthor.username = req.user.username;
                    insertedcomment.save();
                    foundedcampground.comments.push(insertedcomment);
                    foundedcampground.save();
                    req.flash("successmessage","Successfully added the comment!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});
//Delete Functionality
router.get("/campgrounds/:id/comments/:comment_id/delete", middlewareObj.isLoggedIn, function (req, res) {
    console.log(req.params.comment_id);
    Comment.findByIdAndRemove(req.params.comment_id, function (err, removedcomment) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("back");
        }
    });
});

//Update functionality
router.get("/campgrounds/:id/comments/:comment_id/update", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, ucomment) {
        if (err) {
            console.log(err)
        } else {
            res.render("../views/comment/updatecomment", {
                campground_id: req.params.id,
                ucomment: ucomment
            });
        }
    });
});

router.put("/campgrounds/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, {
        $set: {
            cmtdescription: req.body.cmt.description
        }
    }, function (err, ucomment) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;