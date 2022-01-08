// Loads env variables
if (process.env.NODE_ENV !== 'production')
   require('dotenv').config();

// Imports 
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const addUserRec = require('./public/js/regService');
const docInfo = require('./public/js/doctorInfo');

// Const Variables
const server = express();
const PORT = 5500;


// Handles login authentication
const initializedPass = require("./public/js/passport-config");
initializedPass();


// Access to static files
server.use(express.static(__dirname));
server.use('/js', express.static(__dirname + 'public/js'));
server.use('/css', express.static(__dirname + 'public/css'));


// Access to view files
server.use(express.static(__dirname + '/public'));
server.set('views', './views');
server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({ extended: true}));


// Allows usage of flash and session
server.use(flash());
server.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false
}));


// Allows login and logout processes
server.use(methodOverride('_method'));
server.use(passport.initialize());
server.use(passport.session());


// Displays index.html
server.get('', (req, res) => {
   res.sendFile(__dirname + '/views/index.html');
});

server.get('/index', (req, res) => {
   const docName = req.query.docName;
   const dateTime = req.query.dateTime;
   const patient_id = req.user.patient_id;
   console.log(patient_id + " " + docName + " " + dateTime)
   docInfo.makeAppt(patient_id, docName, dateTime);
   res.sendFile(__dirname + '/views/index.html');
});

// Displays Register View
server.get("/register", checkNotAuthenticated, function(req,res) {
   const mess = req.flash('mess');
   res.render("register", {mess});
});


// Handles register POST
server.post("/register", checkNotAuthenticated, async (req, res) => {
   if (req.body.password != req.body.Vpassword) {
      req.flash('mess', 'Passwords do not match, please try again')
      res.redirect('/register');
   }
   else if (req.body.name == '' || req.body.email == '' || req.body.password == '' || req.body.Vpassword == '') {
      req.flash('mess', 'Fields were left empty, please try again')
      res.redirect('/register');
   }
   else {
      const hashedPass = await bcrypt.hash(req.body.password, 10)
      const newID = addUserRec.getLatestID();
      newID.then(function(result) {
         const isAvail = addUserRec.addUser(result, req.body.name, req.body.email, hashedPass)
         isAvail.then(function(result) {
            if (result) {
               req.flash('mess', 'username already exists, try a different email')
               res.redirect('/register');
            }
            else
               res.redirect('/login');
         })
      })
   }
})


// Displays Login View
server.get("/login", checkNotAuthenticated, function(req,res) {
   res.render("login");
});


// Handles login POST
server.post('/login', checkNotAuthenticated, passport.authenticate('local', {
   successRedirect: '/views/index.html',
   failureRedirect: '/login',
   failureFlash: true
}));


// Handles logout POST
server.delete('/logout', checkAuthenticated, (req, res) => {
   req.logOut();
   res.redirect('/login');
});


// Handles appt making
server.post("/makeAppt"/*, checkAuthenticated*/, (req, res) => {
   
})


// Handles displaying of doctors
server.post("/selDoc"/*, checkAuthenticated*/, (req, res) => {
   const docList = docInfo.findDocList();
   docList.then(function(result) {
      const table = result;
      res.render("showTable", {docTable:table})
   });
})


server.get("/docHours", (req, res) => {
   res.render("docHours", {patientID:req.user.patient_id})
})


// Checks if user is authenticated
function checkAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
     return next();
   }
   res.redirect('/login');
 }
 

 // Checks if user is not authenticated
 function checkNotAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
     return res.redirect('./views/index.html');
   }
   next();
 }
 
 
// Listens for localhost
server.listen(PORT, () => console.info('Listening...'));