const redisClient = require('../services/redis.service');

const { REDIS_CACHE_KEY } = process.env;

const compare = (sDocs, id, aNo) => {
  const docs = JSON.parse(sDocs);

  return docs.answers[id].correctAnswer === Number(aNo);
};

const answerQuestion = (id, answerNo) => {
  return redisClient
    .getAsync(REDIS_CACHE_KEY)
    .then((docs) => compare(docs, id, answerNo));
};

module.exports = answerQuestion;
