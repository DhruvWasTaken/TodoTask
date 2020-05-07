// var mongoose = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");
// // var TodoTask = require("../models/ToDoTask.ejs");
// var UserSchema = new mongoose.Schema({
// 	username: String,
//     password: String,
// 	// task: [
// 	// 	{
// 	// 		type: mongoose.Schema.Types.ObjectId,
// 	// 		ref: "TodoTask.ejs"
// 	// 	}
// 	// ]
// });

// UserSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", UserSchema);

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);