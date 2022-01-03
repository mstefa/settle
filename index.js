'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');


const RateRoutes = require('./api/controllers/rates.js')

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  const swaggerOptions = {
    info: {
      title: 'Settle API',
      version: '0.0.1',
    },
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

    //Default Route
    server.route({
      method: "GET",
      path: "/",
      handler: function (req, res) {
        return res.response({status: "Server running"}).code(200);
      }
    });
  
    server.route(RateRoutes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init()