'use strict';

const db = require('../../config/mongodb.js');
const Mongoose = require('mongoose');

const RatesSchema = new Mongoose.Schema({ 
  baseCurrency: String, 
  targetCurrency: String, 
  originalRate: Number, 
  feePercentage: Number,
})

module.exports = db.model('Rates', RatesSchema);

