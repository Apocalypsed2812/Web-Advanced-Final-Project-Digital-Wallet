const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transaction = new Schema(
    {
        phone: { type: String },
        receiver: { type: String },
        number_card: { type: String },
        money: { type: Number },
        fee: { type: Number },
        total: { type: Number },
        type: { type: String },
        note: { type: String },
        status: { type: String },
        operator: { type: String },
        denomination: { type: String },
        content: { type: String },
        userpay: { type: String },
        quantity: { type: Number },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", Transaction);