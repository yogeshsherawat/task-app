var express = require("express"),
    app                     = express(),
    bodyparser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    User                    = require("./models/user"),
    passportLocalMongoose   = require("passport-local-mongoose");


// mongoose connect to mongodb
mongoose.connect("mongodb://localhost/task_app",{useNewUrlParser:true , useUnifiedTopology:true});

app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs'); 
app.use(express.static(__dirname + "/public"));


app.use(require("express-session")({
    secret:"My name is YKS",
    resave:false,
    saveUninitialized:false
}))

// passport inintialization
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser  = req.user;
    next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// homepage route
app.get("/",function(req,res)
{
    res.render("home");
});


// register routes
app.get("/register",function(req,res){
    var chk=0;
    res.render("register",{chk:chk});
})
app.post("/register",function(req,res){
    
            User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err)
        {   var chk=1;
            console.log(err);
            if(err=='UserExistsError');
            console.log("error is here");
            return res.render("register",{chk:chk});
            
        }
        
        passport.authenticate("local")(req,res,function(){
            res.redirect("/dashboard");
        })    
        
    });
    });
    
// logout route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

// dashboard route
app.get("/dashboard",isLoggedIn,function(req,res){
    res.render("dashboard");
});

// login route
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
successRedirect:"/dashboard",
failureRedirect:"/login"
}),function(req,res){});


// middleware function to check if a user is logged in or not
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect("/login");
};


// running o local server
app.listen(3000,'127.0.0.1',function(){
    console.log("server running");
});
