process.env.NODE_ENV = 'prd';
process.env.RUN_FROM = 'local';

module.exports = require('./app.js');