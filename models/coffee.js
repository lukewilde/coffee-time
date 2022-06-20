const mongoose = require('mongoose');

const { Schema } = mongoose;

const coffeeSchema = new Schema({
  name: { type: String, required: true },
  price: { Number, min: [0, 'Negatigve prices are invalid'] },
  description: { type: String, required: true },
  countryOfOrigin: { type: String, required: true },
  decaf: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Coffee', coffeeSchema);
