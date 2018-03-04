const Prismic = require('prismic.io');
const logger = require('winston');
const { forEach } = require('p-iteration');

const redisClient = require('../services/redis.service');


const {
  PRISMIC_API,
  PRISMIC_ACCESS_TOKEN,
  REDIS_CACHE_KEY
} = process.env;

const accessDocuments = (api, token) => {
  return Prismic.api(api, { accessToken: token });
};

const queryDocument = (api) => {
  return api.query();
};

const createChapter = (chapters, key) => {
  return chapters[key]
    ? chapters
    : {
      ...chapters,
      [key]: {
        details: {},
        questions: []
      }
    }
};

const filterData = async (response) => {
  try {
    const { results } = response;

    let chapters = {};
    const answers = {};

    await forEach(results, async (r) => {
      if (r.type === 'chapter') {
        const chapterNo = `chapter__${r.rawJSON.chapter.chapter_no.value}`;

        chapters = createChapter(chapters, chapterNo);

        chapters[chapterNo].details = r.rawJSON;
      }

      if (r.type === 'questions') {
        const chapterNo = `chapter__${r.rawJSON.questions.chapter_no.value}`;

        chapters = createChapter(chapters, chapterNo);

        const woAnswer = {...r.rawJSON.questions, correctanswer: null, id: r.id}
        const wAnswer = { correctAnswer: r.rawJSON.questions.correctanswer.value };

        chapters[chapterNo].questions.push(woAnswer);
        answers[r.id] = wAnswer;
      }
    });

    return {
      chapters,
      answers
    };
  } catch(e) {
    logger.error(e);

    throw new Error('DOCUMENT_NOT_FOUND');
  }
};

const cacheData = (docs) => {
  return redisClient.setAsync(REDIS_CACHE_KEY, JSON.stringify(docs));
}

const updateCache = () => {
  return accessDocuments(PRISMIC_API, PRISMIC_ACCESS_TOKEN)
    .then(queryDocument)
    .then(filterData)
    .then(cacheData);
};

module.exports = updateCache;