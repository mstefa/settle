'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const laabr = require('laabr');

const RateRoutes = require('../controllers/rates.js');

const swaggerOptions = {
  info: {
    title: 'Settle API',
    version: '0.0.1',
  },
};

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

const registerPlugings = async () => {
  await server.register([
  
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      plugin: laabr,
      options: {},
    },
  ]);

  return server
}

//Default Route
server.route({
  method: 'GET',
  path: '/',
  handler: function (req, res) {
    return res.response({ status: 'Server ON' }).code(200);
  },
});

// API Routes 
server.route(RateRoutes);

exports.init = async () => {
  await registerPlugings()
  await server.initialize();
  return server;
};

exports.start = async () => {
  await registerPlugings()
  await server.start();
  console.log('Server running on %s', server.info.uri);
};


process.on('SIGINT', function () {  
  console.info('stopping hapi server')
  server.stop({ timeout: 10000 }).then(function (err) {
    console.log('hapi server stopped')
    process.exit((err) ? 1 : 0)
  })
})

