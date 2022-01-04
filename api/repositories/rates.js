'use strict';

// const Rates = require('./entity/rates');

class RateRepository {
  constructor(rates) {
    this.Rates = rates
  }

  getRatesByPair = async (baseCurrency, targetCurrency) => {
    const rate = await this.Rates.findOne({
      baseCurrency: baseCurrency,
      targetCurrency: targetCurrency,
    });

    return rate;
  };

  updateRate = async (rateDetail) => {
    const res = await this.Rates.updateOne(
      { baseCurrency: rateDetail.pair.base, targetCurrency: rateDetail.pair.target },
      { originalRate: rateDetail.originalRate, feePercentage: rateDetail.feePercentage }
    );
    return res;
  };

  createRate = async (rateDetail) => {
    const res = await this.Rates.updateOne(
      { baseCurrency: rateDetail.pair.base, targetCurrency: rateDetail.pair.target },
      { originalRate: rateDetail.originalRate, feePercentage: rateDetail.feePercentage },
      { upsert: true }
    );

    return res;
  };
}

module.exports = RateRepository;
