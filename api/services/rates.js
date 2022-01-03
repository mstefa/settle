'use strict';

const axios = require('axios').default;

const RateDetail = require('../domain/ratesDetail')


class RateService {
  constructor(rateRepository) {
    this.rateRepository = rateRepository;
  }

  createRates = async () => {

    let newRates = [{
      baseCurrency: 'EUR',
      targetCurrency: 'USD',
      originalRate: 10,
      feePercentage: 0.1
    }]

    for (let i = 0; i < newRates.length; i++){

      const rate = await this.rateRepository.getRatesByPair(newRates[i].baseCurrency, newRates[i].targetCurrency);
      console.log(rate)

      if (!rate){
      console.log(newRates[i].baseCurrency)
      let rateDetail = new RateDetail(
        newRates[i].baseCurrency,
        newRates[i].targetCurrency,
        newRates[i].originalRate,
        newRates[i].feePercentage,
        );
        console.log("writting", rateDetail)
        const update = await this.rateRepository.createRate(rateDetail);
        console.log(`update`, update)
      }
    }
  }

  getRate = async (baseCurrency, targetCurrency) => {
    const rate = await this.rateRepository.getRatesByPair(baseCurrency, targetCurrency);

    const Response = new RateDetail(
      baseCurrency,
      targetCurrency,
      rate.originalRate,
      rate.feePercentage,
    );
    return Response.toDto();
  };

  updateRates = async () => {
    let updatedRates= {
      success: true,
      timestamp: 1640816643,
      base: 'EUR',
      date: '2021-12-29',
      rates: { USD: 1.134816, ARS: 116.482601, BRL: 6.472535 },
    };
    // try {
    //     updatedRates= await axios.get('http://data.fixer.io/api/latest?access_key=e6f2479f26b0ef8020ea0cd30c5e9608&symbols=USD,ARS,BRL');

    // } catch (error) {
    //   console.error(error);
    // }

    let ratesCalculation = [
      {
        baseCurrency: 'EUR',
        targetCurrency: 'USD',
        rate: updatedRates.rates.USD,
      },
      {
        baseCurrency: 'EUR',
        targetCurrency: 'ARS',
        rate: updatedRates.rates.ARS,
      },
      {
        baseCurrency: 'EUR',
        targetCurrency: 'BRL',
        rate: updatedRates.rates.BRL,
      },
      {
        baseCurrency: 'USD',
        targetCurrency: 'ARS',
        rate: updatedRates.rates.ARS / updatedRates.rates.USD,
      },
      {
        baseCurrency: 'USD',
        targetCurrency: 'BRL',
        rate: updatedRates.rates.BRL / updatedRates.rates.USD,
      },
      {
        baseCurrency: 'BRL',
        targetCurrency: 'ARS',
        rate: updatedRates.rates.ARS / updatedRates.rates.BRL,
      },
    ];

    let response = []

    for (let i = 0; i < ratesCalculation.length; i++){

      const rate = await this.rateRepository.getRatesByPair(ratesCalculation[i].baseCurrency, ratesCalculation[i].targetCurrency);

      if (rate && Object.keys(rate).length > 0){

        let rateDetail = new RateDetail(
          ratesCalculation[i].baseCurrency,
          ratesCalculation[i].targetCurrency,
          ratesCalculation[i].originalRate,
          ratesCalculation[i].feePercentage,
          );

        rateDetail.updateOriginalRate(ratesCalculation[i].rate)
        
        const update = await this.rateRepository.updateRate(rateDetail);

        // error handler

        response.push(rateDetail.toDto())  

        }
        else {

          response.push({pair: ratesCalculation[i].baseCurrency + ratesCalculation[i].targetCurrency, error: "this can not be updated"} )
          
        }
    };

    return response;
  };
}

module.exports = RateService;
