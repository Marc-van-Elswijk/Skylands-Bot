const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    game: { type: String, required: true },
    rarity: { type: String, required: true },
    value: { type: Number, required: true },
});

module.exports = cardSchema;