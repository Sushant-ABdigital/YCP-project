var express = require('express');
var bodyparser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var flash = require('connect-flash');

//Models
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require("./models/users");

//Router catch primary
var campgroundRoutes = require("./routes/campground");
var commentRoutes = require("./routes/comment");
var indexRoutes = require("./routes/index");

var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

//Usage of modules
var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));

//Passport stuff
app.use(require('express-session')({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("successmessage");
    res.locals.error = req.flash("errormessage");
    next();
});

//mongoDB stuff
mongoose.connect("mongodb://localhost/ycpre", {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

//Set the app files
app.set('view engine', 'ejs');


//Use catched routers
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

//Create middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};


//Application initialises
app.get("/", (req, res) => {
    res.render("home");
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server running at port: ' + port);
});