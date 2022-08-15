const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs =  require("ejs");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./models/userSchema.js");
const Task = require("./models/taskSchema")

dotenv.config()


//the database stuff
const connect =async () => {
    try {
      await mongoose.connect(process.env.MONGO);
      console.log("connected to the database")
    } catch (error) {
      handleError(error);
    }}
    
    mongoose.connection.on('disconected', err => {
        logError(err);
        console.log("database connection problem")
      });


      app.use(session({
        secret: 'supersecret',
        resave: false,
        saveUninitialized: true,
       
      }))

      app.set("view engine", "ejs");
      //middlewares
        app.use(express.urlencoded({ extended : false}))
        app.use(express.json())
        app.use(passport.initialize());
        app.use(passport.session());


        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });
        
        passport.deserializeUser(function (id, done) {
            User.findById(id, function (err, user) {
                done(err, user);
            });
        });
        
        
        passport.use(new localStrategy(function (username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) return done(err);
                if (!user) return done(null, false, { message: 'Incorrect username.' });
        
                bcrypt.compare(password, user.password, function (err, res) {
                    if (err) return done(err);
                    if (res === false) return done(null, false, { message: 'Incorrect password.' });
                                return done(null, user);
                });
            });
        }));

     

        //home route
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.redirect('/');
}


      //routes


      //HOME ROUTE
      app.get('/',isLoggedIn, (req, res) => {
        const userInfo = req.user

        res.render("home",{userInfo})
      });
        //post a task
      app.post('/', (req, res) => {
        console.log(req.body.list);

      });

      app.get('/login',isLoggedOut, (req, res) => {
        res.render("login")
      });
      

app.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect:"/login",
    
  }))

  app.get('/register',isLoggedOut, (req, res) => {
    res.render("register");
  });

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.genSalt(10, function(err,salt){
        if(err){
            console.log("err generating salt")
            return next(err);
        } bcrypt.hash(password,salt,function(err,hash){
            if(err){
                console.log("err hashing password")
                return next(err)
            }
            const newUser = new User({
                username : username,
                password: hash
            });
            newUser.save();
            res.redirect("/login")
        })
    })
    
});

app.post('/list', async(req, res) => {
    const listItem = req.body.list
    const userId = req.user._id
    const newTask = new Task({
      task : listItem,
      startTime : req.body.startTime,
      endTime : req.body.endTime,
      taskUser : userId

   });
   newTask.save();
   console.log(newTask)
   res.redirect("/")

});


      app.listen(3000, () => {
        connect()
        console.log('App listening on port 3000!');
      });
