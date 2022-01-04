'use strict';

const expect = require('chai').expect
const { init } = require('../../api/config/server');

jest.setTimeout(10000)

describe('GET /', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
    });
});