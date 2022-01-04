'use strict';

const expect = require('chai').expect;

const { init } = require('../../api/config/server');
const RateController = require('../../api/controllers/rates.js');
const RateService = require('../../api/services/rates');
const RateRepository = require('../../api/repositories/rates');

jest.setTimeout(10000);

describe('GET /rate', () => {
  let server;

  afterEach(async () => {
    await server.stop();
  });

  it('succesful path', async () => {
    //given
    let entityResponse = {
      baseCurrency: 'USD',
      targetCurrency: 'ARS',
      originalRate: 1,
      feePercentage: 0.1,
    };

    let entityMock = {
      findOne: jest.fn(() => entityResponse),
    };
    const rateRepository = new RateRepository(entityMock);
    const rateService = new RateService(rateRepository);
    const rateController = new RateController(rateService);

    server = await init(rateController.getControllers());

    //when
    const res = await server.inject({
      method: 'GET',
      url: '/rate?base=USD&target=ARS',
    });

    //expect
    let expected =
      '{"name":"USDARS","pair":{"base":"USD","target":"ARS"},"originalRate":1,"feePercentage":0.1,"feeAmount":0.1,"finalRate":1.1}';
    expect(res.payload).to.deep.equal(expected);
    expect(res.statusCode).to.equal(200);
  });
});
