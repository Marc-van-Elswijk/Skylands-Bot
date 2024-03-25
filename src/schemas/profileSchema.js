const mongoose = require(`mongoose`);

const profileSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    name: { type: String, require: true, unique: true},
    SkyCoins: { type: Number, default: 10 }, //currency
    dailyLastUsed: { type: Number, default: 0 },
    cardInventory: [{ skylanderid: Number, name: String, photo: String , element: String, rarity: String, value: Number, health: Number, strength: Number, defense: Number, count: Number }]
});

const model = mongoose.model("skylandsdb", profileSchema);

module.exports = model;
