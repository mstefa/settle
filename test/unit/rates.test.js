
const expect = require('chai').expect
const RateService = require("../../api/services/rates")
const RateDetail = require('../../api/domain/ratesDetail')

// const mockCallback = jest.fn((x) => 42 + x);
// forEach([0, 1], mockCallback);

// // The mock function is called twice
// expect(mockCallback.mock.calls.length).toBe(2);

// // The first argument of the first call to the function was 0
// expect(mockCallback.mock.calls[0][0]).toBe(0);

// // The first argument of the second call to the function was 1
// expect(mockCallback.mock.calls[1][0]).toBe(1);

// // The return value of the first call to the function was 42
// expect(mockCallback.mock.results[0].value).toBe(42);

describe('rate controller', () => {
  it('rates', async () => {
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

    // console.log(repositoryMock.getRatesByPair.mock.calls[0])

    //assert
    expect(response).to.deep.equal(expected);
    // expect(repositoryMock.getRatesByPair.mock.calls.length).toBe(2)


  });
});
