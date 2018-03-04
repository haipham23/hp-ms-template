const Rp = require('hp-rp-factory');

const updateCache = require('../apis/updateCache');
const getChapterByNo = require('../apis/getChapterByNo');
const answerQuestion = require('../apis/answerQuestion');

const rp = new Rp([
  'DOCUMENT_NOT_FOUND'
]);

const routes = [{
  method: 'get',
  path: '/api/health-check',
  func: (req, res) => rp.ok(res, 'ok')
}, {
  method: 'get',
  path: '/api/update-cache',
  func: (req, res) => {
    updateCache()
      .then(() => rp.ok(res, 'ok'))
      .catch(error => rp.error(res, error))
  }
}, {
  method: 'get',
  path: '/api/chapter/:chapterNo',
  func: (req, res) => {
    getChapterByNo(req.params.chapterNo)
      .then((chapter) => rp.ok(res, chapter))
      .catch(error => rp.error(res, error))
  }
}, {
  method: 'get',
  path: '/api/answer/:qId/:aNo',
  func: (req, res) => {
    answerQuestion(req.params.qId, req.params.aNo)
      .then((result) => rp.ok(res, result))
      .catch(error => rp.error(res, error))
  }
}]

module.exports = routes;