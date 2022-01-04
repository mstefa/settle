`use strict`;
require('dotenv').config()

const { start } = require('./api/config/server');
const RateController = require('./api/controllers/rates.js');
const RateService = require('./api/services/rates');
const RateRepository = require('./api/repositories/rates');
const Rates = require('./api/repositories/entity/rates');

const rateRepository = new RateRepository(Rates);
const rateService = new RateService(rateRepository);
const rateController = new RateController(rateService)

server = start(rateController.getControllers());
