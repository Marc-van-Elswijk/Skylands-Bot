const mongoose = require(`mongoose`);

const cardSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    cardId: { type: Number, require: true},
    cardBack: { type: String, require: true },
    cardFront: { type: String, require: true }
});

const model = mongoose.model("SkyCards", cardSchema);

module.exports = model;
