require('dotenv').config();

const Microservice = require('hp-ms-core');

const routes = require('./routes');

new Microservice({
  routes,
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL
}).init();