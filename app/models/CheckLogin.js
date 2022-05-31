const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Login = new Schema({
    username: { type: String },
    count: { type: Number, default: 0 },
    unusual: { type: Number, default: 0 },
});

module.exports = mongoose.model("Login", Login);