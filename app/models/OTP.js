const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTP = new Schema(
    {
        phone: { type: String },
        code: { type: String },
        type: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("OTP", OTP);