'use strict';
const Joi = require('joi');

const Exceptions = require('../domain/exceptions');

const responseModel = Joi.object({
  name: Joi.string(),
  pair: Joi.object({
    base: Joi.string(),
    target: Joi.string(),
  }),
  originalRate: Joi.number().max(100),
  feePercentage: Joi.number().max(1),
  feeAmount: Joi.number().max(1),
  finalRate: Joi.number().max(101),
}).label('Result');

const responseArray = Joi.array().items(responseModel);

class RateController {
  constructor(rateService) {
    this.rateService = rateService;

    this.getRate = {
      method: 'GET',
      path: '/rate',
      handler: async (req, res) => {
        let baseCurrency = req.query.base;
        let targetCurrency = req.query.target;

        try {
          let response = await rateService.getRate(baseCurrency, targetCurrency);
          return res.response(response).code(200);
        } catch (e) {
          if (e instanceof Exceptions.Exception) {
            return res.response(e.toDto()).code(e.statusCode);
          }
          throw e;
        }
      },
      options: {
        tags: ['api'],
        validate: {
          query: Joi.object({
            base: Joi.string().regex(/[A-Z]{2,4}/).required(),
            target: Joi.string().regex(/[A-Z]{2,4}/).required(),
          }),
        },
        response: {
          failAction: 'log',
          schema: responseModel,
        },
      },
    };

    this.updateRates = {
      method: 'PATCH',
      path: '/rates',
      handler: async (_, res) => {
        try {
          let response = await rateService.updateRates();
          return res.response(response).code(201);
        } catch (e) {
          if (e instanceof Exceptions.Exception) {
            return res.response(e.toDto()).code(e.statusCode);
          }
          throw e;
        }
      },
      options: {
        tags: ['api'],
        response: {
          failAction: 'log',
          schema: responseArray,
        },
      },
    };

    this.updateFee = {
      method: 'PATCH',
      path: '/fees',
      handler: async (req, res) => {
        try {
          let response = await rateService.updateFees(req.payload);
          return res.response(response).code(201);
        } catch (e) {
          if (e instanceof Exceptions.Exception) {
            return res.response(e.toDto()).code(e.statusCode);
          }
          throw e;
        }
      },
      options: {
        tags: ['api'],
        response: {
          failAction: 'log',
          schema: responseArray,
        },
        validate: {
          payload: Joi.object({
            baseCurrency: Joi.string().required(),
            targetCurrency: Joi.string().required(),
            newFeePercentage: Joi.number().required(),
          }).required(),
        },
      },
    };
  }

  getControllers() {
    return [this.getRate, this.updateRates, this.updateFee];
  }
}

module.exports = RateController;
