class RateDetail {
  constructor(baseCurrency, targetCurrency, originalRate, feePercentage) {
    this.name = baseCurrency + targetCurrency;
    this.pair = {
      base: baseCurrency,
      target: targetCurrency,
    };
    this.originalRate = originalRate;
    this.feePercentage = feePercentage;
    this.feeAmount = feePercentage * originalRate;
    this.finalRate = originalRate + this.feeAmount;
  }

  updateOriginalRate = (newRate) => {
    this.originalRate = newRate;
    this.feeAmount = this.feePercentage * newRate;
    this.finalRate = newRate + this.feeAmount;
  };

  updateFeePercentage = (newPercentage) => {
    this.feePercentage = newPercentage;
    this.feeAmount = newPercentage * this.originalRate;
    this.finalRate = this.originalRate + this.feeAmount;
  };

  toDto = () => {
    this.name,
    this.pair,
    this.originalRate, 
    this.feePercentage,
    this.feeAmount, 
    this.finalRate
  }
}

module.exports = RateDetail