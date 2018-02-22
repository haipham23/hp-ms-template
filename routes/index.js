const Rp = require('hp-rp-factory');

const rp = new Rp([]);

const routes = [{
  method: 'get',
  path: '/api/health-check',
  func: (req, res) => rp.ok(res, 'ok')
}]

module.exports = routes;