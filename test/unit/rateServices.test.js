const expect = require('chai').expect
const RateService = require("../../api/services/rates")
const RateDetail = require('../../api/domain/ratesDetail')
const Exceptions = require('../../api/domain/exceptions')

describe('get Rate', () => {
  it('Case: Succes', async () => {
    // given
    let entity = {
      baseCurrency: 'USD',
      targetCurrency: 'ARS',
      originalRate: 1,
      feePercentage: 0.1,
    };
    
    let expected = new RateDetail(
      entity.baseCurrency,
      entity.targetCurrency,
      entity.originalRate,
      entity.feePercentage
      ).toDto()

    let repositoryMock = {
      getRatesByPair: jest.fn(() => entity )
    };

    //when
    const rateService = new RateService( repositoryMock )
    let response = await rateService.getRate("USD", "ARS")

    //assert
    expect(response).to.deep.equal(expected);
  });

  it('Case: Not Found', async () => {
    // given
    let entity = {
      baseCurrency: 'USD',
      targetCurrency: 'ARS',
      originalRate: 1,
      feePercentage: 0.1,
    };
    
    let expected = new RateDetail(
      entity.baseCurrency,
      entity.targetCurrency,
      entity.originalRate,
      entity.feePercentage
      ).toDto()

    let repositoryMock = {
      getRatesByPair: jest.fn(() => {} )
    };

    //when
    const rateService = new RateService( repositoryMock )
    let error;
    try{
      let response = await rateService.getRate("USD", "ARS")
    }catch (e) {
      error = e
    }
    
    //assert
    console.log(`error`, error.message)
    expect(error.message).to.be.equal('Pair USDARS was not found');
  });
});
