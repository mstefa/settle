'use strict';

const Rates = require('./entity/rates');

// const USDARS = new Rates({
// baseCurrency: "USD",
// targetCurrency: "ARS",
// originalRate: 1,
// feePercentage: 0.1,
// feeAmount: 0.1,
// finalRate: 1.1
// });
// USDARS.save().then((e) => console.log(e));

class RateRepository {
  constructor() {}

  getRatesByPair = async (baseCurrency, targetCurrency) => {
    const rate = await Rates.findOne({
      baseCurrency: baseCurrency,
      targetCurrency: targetCurrency,
    });

    return rate;
  };

  updateRate = async (rateDetail) => {
    const res = await Rates.updateOne(
      { baseCurrency: rateDetail.pair.base, targetCurrency: rateDetail.pair.target },
      { originalRate: rateDetail.originalRate, feePercentage: rateDetail.feePercentage }
    );
    return res;
  };

  createRate = async (rateDetail) => {
    const res = await Rates.updateOne(
      { baseCurrency: rateDetail.pair.base, targetCurrency: rateDetail.pair.target },
      { originalRate: rateDetail.originalRate, feePercentage: rateDetail.feePercentage },
      { upsert: true }
    );

    return res;
  };
}
// const rateRepository = {
//   getRatesByPair,
//   updateRate,
//   createRate
// };

module.exports = RateRepository;
