var mongoose = require("mongoose");

var todoTaskSchema = mongoose.Schema({
    content: {
		type: String,
		required: true
	},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("ToDoTask", todoTaskSchema);
