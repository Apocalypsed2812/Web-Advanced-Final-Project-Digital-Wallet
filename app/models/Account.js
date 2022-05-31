const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    email: { type: String, unique: true },
    name: { type: String },
    role: { type: String, required: true },
    phone: { type: String, unique: true },
    before: { type: String },
    address: { type: String },
    after: {type: String},
    status: {type: String},
    date: {type: String},
    token: {type: Number},
    balance: {type: Number, default: 0},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Account', Account);