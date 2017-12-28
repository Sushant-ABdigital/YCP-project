//Local Strategy
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

userSchema.plugin(passportLocalMongoose);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//AUTH ROUUTES
//>>1. Register route
app.get("/register", function(req, res){
    res.render('register');
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, createduser){
        if(err){
            console.log(err);
            return res.redirect('/register');
        }else{
            //console.log(createduser);
            res.redirect("/");
        }
    });
});

//>> 2. Login routes
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res){
});

//>> 3. Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});