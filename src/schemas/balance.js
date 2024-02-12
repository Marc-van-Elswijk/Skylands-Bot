const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    balance: {type: Number, default: 0 },
});

module.exports = mongoose.model("Balance", balanceSchema, "balances");