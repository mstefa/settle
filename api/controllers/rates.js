'use strict';
const Joi = require('joi');

const RateService = require("../services/rates")
const RateRepository = require("../repositories/rates")
const Exceptions = require('../domain/exceptions')

const rateRepository = new RateRepository()
const rateService = new RateService(rateRepository)

const responseModel = Joi.object({
  name : Joi.string(),
  pair: Joi.object({
    base: Joi.string(),
    target: Joi.string(),
  }),
  originalRate: Joi.number().max(100),
  feePercentage: Joi.number().max(1),
  feeAmount: Joi.number().max(1),
  finalRate: Joi.number().max(101),
}).label('Result');

const responseArray = Joi.array().items(responseModel)

const getRate ={
  method: 'GET',
  path: '/rate',
  handler: async (req, res)  => {

    let baseCurrency = req.query.base
    let targetCurrency = req.query.target

    try {

      let response = await rateService.getRate(baseCurrency, targetCurrency);
      return res.response(response).code(200)

    }
    catch (e){

      if (e instanceof Exceptions.Exception ){
        console.error(e.toString())
        return res.response(e.message).code(e.statusCode)
      }

      throw e
    }
  },
  options: {
    tags: ['api'],
    validate: {
      query: Joi.object({
        base: Joi.string().valid('USD', 'EUR', 'BRL').required(), 
        target: Joi.string().valid('USD', 'BRL', 'ARS').required(), 
      }),
    },
    response:{
      failAction: 'log',
      schema: responseModel
    }
  },
};


const updateRates ={
  method: 'PATCH',
  path: '/rates',
  handler: async ( _ , res)  => {

    let response = await rateService.updateRates();

    return res.response(response).code(201)
  },
  options: {
    tags: ['api'],
    response:{
      failAction: 'log',
      schema: responseArray
    }
  },
};


const createRates ={
  method: 'POST',
  path: '/rates',
  handler: async ( _ , res)  => {

    let response = await rateService.createRates();

    return res.response(response).code(201)
  },
  options: {
    tags: ['api'],
    response:{
      failAction: 'log',
      schema: responseArray
    }
  },
};

module.exports = [
  getRate,
  updateRates,
  createRates,
]

