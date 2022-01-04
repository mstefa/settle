const expect = require('chai').expect
const RateRepository = require('../../api/repositories/rates');

describe('Repository getRatesByPair', () => {
  it('Case: Succes', async () => {
    // given
    let entityResponse = {
      baseCurrency: 'USD',
      targetCurrency: 'ARS',
      originalRate: 1,
      feePercentage: 0.1,
    };

    let entityMock = {
      findOne: jest.fn(() => entityResponse )
    };

    const rateRepository = new RateRepository(entityMock);

    //when
    const rate = await rateRepository.getRatesByPair('USD', 'ARS');

    //assert
    expect(rate).to.deep.equal(entityResponse);
  
  });


});