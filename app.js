var express = require("express"),
    app                     = express(),
    bodyparser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    User                    = require("./models/user");
    passportLocalMongoose   = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/task_app",{useNewUrlParser:true , useUnifiedTopology:true});
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs'); 
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret:"My name is YKS",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser  = req.user;
    next();
})

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/",function(req,res)
{
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render('register');
            
        }
        
        passport.authenticate("local")(req,res,function(){
            res.redirect("/dashboard");
        })

    });
});


app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
app.get("/dashboard",isLoggedIn,function(req,res){
    res.render("dashboard");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
successRedirect:"/dashboard",
failureRedirect:"/login"
}),function(req,res){});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect("/login");
};



app.listen(3000,'127.0.0.1',function(){
    console.log("server running");
});
