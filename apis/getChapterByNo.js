const redisClient = require('../services/redis.service');

const { REDIS_CACHE_KEY } = process.env;

const filterChapterByNo = (sDocs, no) => {
  const docs = JSON.parse(sDocs);

  return docs.chapters[no];
};

const getChapterByNo = (no) => {
  const chapterNo = `chapter__${no}`;

  return redisClient
    .getAsync(REDIS_CACHE_KEY)
    .then((sDocs) => filterChapterByNo(sDocs, no));
};

module.exports = getChapterByNo;
