const mongoose = require(`mongoose`);

const profileSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    SkyCoins: { type: Number, default: 10 },
    dailyLastUsed: { type: Number, default: 0 },
    cardInventory: [{ name: String, rarity: String, value: Number, count: Number }]
});

const model = mongoose.model("skylandsdb", profileSchema);

module.exports = model;
