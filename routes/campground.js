var express = require('express');
var mongoose = require('mongoose');
var Campground = require("../models/campground");
var router = express.Router({mergeParams:true});
var middlewareObj = require("../middleware");

router.get("/campgrounds", function(req, res){
    var noMatch;
    if(req.query.searchquery){
        //console.log(req.query.searchquery);
        const regex = new RegExp(escapeRegex(req.query.searchquery), 'gi');
        Campground.find({name: regex}, function(err, campground){
            if(err){
                console.log(err);
            }else{
                // console.log("***New***")
                // console.log(campground);
                if(campground.length < 1){
                    noMatch = "No matched campground!";
                }
                res.render("../views/campground/campgrounds", {campground: campground, noMatch: noMatch});
            }
        });
    } else {
        Campground.find({}, function(err, campground){
            if(err){
                console.log(err);
            }else{
                // console.log("***New***")
                //console.log(campground);
                res.render("../views/campground/campgrounds", {campground: campground, noMatch: noMatch});
            }
        });
    }
});

//Addition of new campground
router.get("/campgrounds/new", middlewareObj.isLoggedIn, function(req, res){
    res.render('../views/campground/new');
});

router.post("/campgrounds/new",middlewareObj.isLoggedIn, function(req, res){
    //console.log(req.user);
    //Grab the data from form
    var name = req.body.cg.name;
    var image = req.body.cg.image;
    var description = req.body.cg.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create({name: name, image: image, description:description,author:author
    }, function(err, campground){
        if(err){
            console.log(err);
        }else{
            //console.log(campground);
            res.redirect("/campgrounds");
        }
    });
});

router.get('/campgrounds/:id', function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundedcampground){
        if(err){
            console.log(err);
        } else {
            //console.log(foundedcampground);
            res.render('../views/campground/singlecamp', {foundedcampground:foundedcampground});
        }
    });
});

//Update functionality
router.get("/campgrounds/:id/update", middlewareObj.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundedcampground){
            res.render('../views/campground/update', {foundedcampground:foundedcampground});
        }); 
});

router.put("/campgrounds/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, {$set: {
        name: req.body.cg.name,
        image: req.body.cg.image,
        description: req.body.cg.desc
    }
    }, function(err, updatedcampground){
        if(err){
            console.log(err);
        } else {
            // console.log("previous data");
            // console.log(updatedcampground);
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


//Delete Functionality
router.delete("/campgrounds/:id/delete", middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/campgrounds");
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;