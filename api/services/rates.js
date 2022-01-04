'use strict';

const axios = require('axios').default;

const RateDetail = require('../domain/ratesDetail')
const Exceptions = require('../domain/exceptions')


class RateService {
  constructor(rateRepository) {
    this.rateRepository = rateRepository;
  }

  createRates = async (newRates) => {

    for (let i = 0; i < newRates.length; i++){

      const rate = await this.rateRepository.getRatesByPair(newRates[i].baseCurrency, newRates[i].targetCurrency);

      if (!rate){
      let rateDetail = new RateDetail(
        newRates[i].baseCurrency,
        newRates[i].targetCurrency,
        newRates[i].originalRate,
        newRates[i].feePercentage,
        );

        const update = await this.rateRepository.createRate(rateDetail);
      }
    }
  }

  getRate = async (baseCurrency, targetCurrency) => {

    let rate;
    try {

      rate = await this.rateRepository.getRatesByPair(baseCurrency, targetCurrency);
    
    }catch (e){
      const apiError = new Exceptions.InternalServerError('Error getting pair: ' + baseCurrency + targetCurrency)
      console.error(apiError.toString());
      console.error(e)
      throw apiError
    }
    
    if (rate && Object.keys(rate).length > 0){
      const Response = new RateDetail(
        baseCurrency,
        targetCurrency,
        rate.originalRate,
        rate.feePercentage,
      );

      return Response.toDto();
    }
    else{
      const apiError = new Exceptions.NotFound('Pair '+ baseCurrency + targetCurrency + ' was not found')
      console.info(apiError.toString());
      throw apiError
    } 
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
      let rateDetail

      if (rate && Object.keys(rate).length > 0){

        rateDetail = new RateDetail(
          ratesCalculation[i].baseCurrency,
          ratesCalculation[i].targetCurrency,
          rate.originalRate,
          rate.feePercentage,
          );
        }
        else {

          rateDetail = new RateDetail(
            ratesCalculation[i].baseCurrency,
            ratesCalculation[i].targetCurrency,
            0,
            0,
            );
          
        }

        rateDetail.updateOriginalRate(ratesCalculation[i].rate)
        
        const update = await this.rateRepository.updateRate(rateDetail);

        response.push(rateDetail.toDto())  
    };

    return response;
  };
}

module.exports = RateService;
