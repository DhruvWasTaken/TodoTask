var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    flash			      = require("connect-flash"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
// const MongoClient = require('mongodb').MongoClient;

var app = express();
app.set('view engine', 'ejs');
var router = express.Router();
var path = __dirname + '/views/';
var port = process.env.PORT || 3000;
app.use(express.static("public"));   
// const connectionString = 'mongodb+srv://DhruvWasTaken:#Dhruv12345@cluster0-kmhqk.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect('mongodb+srv://dhruvanand:dhruvanand@cluster0-kmhqk.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

const TodoTask = require("./models/todom.js");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Dhruv Anand",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(function (req, res, next) {
//     res.locals.user = req.User;
//     next();
// });
app.use(function(req, res, next){
   res.locals.currentUser = req.User;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


//============
// ROUTES
//============

app.get("/", function(req, res){
   res.render(path + "home.ejs"); 
});
app.get("/home", function(req, res){
   res.render(path + "home.ejs"); 
});

app.get("/howto", function(req, res){
   res.render(path + "howto.ejs"); 
});
app.get("/contact", function(req, res){
   res.render(path + "contact.ejs"); 
});

// GET METHOD
app.get("/mylist", isLoggedIn, (req, res) => {
TodoTask.find({}, (err, tasks) => {
res.render("todo.ejs", { todoTasks: tasks });
});
});

//POST METHOD
app.post('/mylist',isLoggedIn, async (req, res) => {
const todoTask = new TodoTask({
content: req.body.content
});
try {
await todoTask.save();
res.redirect("/mylist");
} catch (err) {
res.redirect("/mylist");
}
});

//UPDATE
app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/mylist");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndRemove(id, err => {
if (err) return res.send(500, err);
res.redirect("/mylist");
});
});


// Auth Routes

//show sign up form
app.get("/register", function(req, res){
   res.render(path + "register.ejs"); 
});
//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username,email: req.body.email}), req.body.password, function(err, user){
        if(err){
           req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome " + user.username);
			return res.redirect("/mylist");
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render(path + "login.ejs"); 
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/mylist",
    failureRedirect: "/login"
}) ,function(req, res){
	if(err){
           req.flash("error", err.message);
            return res.redirect("/login");
        }
});

app.get("/logout", function(req, res){
    req.logout();
	req.flash("success", "Logged you out!");
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

// function checkOwnership (req, res, next) {
//  if(req.isAuthenticated()){
//         TodoTask.findById(req.params.task_id, function(err, task){
//            if(err){
//                res.redirect("back");
//            }  else {
//                // does user own the comment?
//             if(task.author.id.equals(req.user._id)) {
//                 next();
//             } else {
//                 req.flash("error", "You don't have permission to do that");
//                 res.redirect("back");
//             }
//            }
//         });
//     } else {
//         req.flash("error", "You need to be logged in to do that");
//         res.redirect("back");
//     }
// }

app.listen(port,function(){
  console.log("Live at Port "+ port);
});
