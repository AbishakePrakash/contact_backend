const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter the username"]
    },
    email: {
        type: String,
        required: [true, "Please enter the email address"],
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        required: [true, "Please enter the User Password"]
    },
},{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema)