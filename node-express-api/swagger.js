const swaggerJSDoc = require('swagger-jsdoc');
const { koaSwagger } = require('koa2-swagger-ui');


const port = 5000;

// Swagger definition
const swaggerDefinition = {
  info: {
    title: 'App APIs',
    version: '1.0.0',
    description: 'API',
  },
  host: `localhost:${port}`,
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swagger = koaSwagger({
  routePrefix: '/swagger',
  swaggerOptions: {
    url: `http://localhost:${port}/swagger.json`,
  },
});

module.exports = { swagger, swaggerSpec };
