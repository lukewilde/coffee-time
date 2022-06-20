const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const coffeeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, min: 0, required: true },
  description: { type: String, required: true },
  countryOfOrigin: { type: String, required: true },
  decaf: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
});

coffeeSchema.plugin(uniqueValidator);

const CoffeeModel = mongoose.model('Coffee', coffeeSchema);

module.exports = CoffeeModel;
