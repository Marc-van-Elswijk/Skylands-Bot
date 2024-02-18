const mongoose = require(`mongoose`);
const cardSchema = require('./cardSchema')

const profileSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    SkyCoins: { type: Number, default: 10 },
    dailyLastUsed: { type: Number, default: 0 },
    cardInventory: [cardSchema]
});

const model = mongoose.model("skylandsdb", profileSchema);

module.exports = model;
