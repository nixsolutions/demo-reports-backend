
require('./bootstrap');

const app = module.exports = require('koa')();
const swagger = require('swagger-koa');
const serve = require('koa-static');
const jwt = require('koa-jwt');

app.use(swagger.init({
  apiVersion: '1.0',
  swaggerVersion: '2.2.5',
  basePath: `http://${process.env.HOST}:${process.env.PORT}`,
  swaggerURL: '/swagger',
  swaggerJSON: '/api-docs.json',
  swaggerUI: './public/swagger/',
  apis: ['./auth.yml', './reports.yml']
}));

app.use(serve(__dirname + '/public'));

app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());
app.use(require('koa-cors')());
require('koa-validate')(app);

app.use(require('./lib/response'));
require('./lib/acl')(app);

app.use(jwt({ secret: process.env.AUTH_JWT_SECRET }).unless({ path: ['/auth/sign-in', '/auth/sign-up'] }));
require('./app/routes')(app);

if (!module.parent) {
  app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Listen on: ${process.env.HOST}:${process.env.PORT}`);
  });
}
