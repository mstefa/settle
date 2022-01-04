'use strict';

const expect = require('chai').expect;

const { init } = require('../../api/config/server');
const RateController = require('../../api/controllers/rates.js');
const RateService = require('../../api/services/rates');
const RateRepository = require('../../api/repositories/rates');

jest.setTimeout(10000);

describe('GET /rate', () => {
  let server;

  beforeAll(async () => {
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
  });

  afterAll(async () => {
    await server.stop();
  });

  it('succesful path', async () => {
    //given
    let expected =
      '{"name":"USDARS","pair":{"base":"USD","target":"ARS"},"originalRate":1,"feePercentage":0.1,"feeAmount":0.1,"finalRate":1.1}';
    
    //when
    const res = await server.inject({
      method: 'GET',
      url: '/rate?base=USD&target=ARS',
    });

    //expect
    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.deep.equal(expected);
  });

  it('responds 400 when the request do not follow requirement', async () => {

    //when
    const res = await server.inject({
      method: 'GET',
      url: '/rate?base=BADREQUEST&target=ARS',
    });

    //expect
    expect(res.statusCode).to.equal(400);
  });
});
