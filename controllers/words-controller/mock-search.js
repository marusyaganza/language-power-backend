const { formatData } = require('../helpers');
const HttpError = require('../../models/http-error');

const mocks = ['shoal', 'ball', 'court', 'demure', 'doll', 'hit', 'rubber', 'wot']
async function mockSearch(req, res, next) {
    const { query } = req.params;
    if (! mocks.includes(query)) {
      next(new HttpError(`mock search wordks only with words: ${mocks.join(', ')}.`, 422));
    }
    const  response = mocks.includes(query) ?  require(`./mocks/${query}.json`) : {};
    const formattedRes = formatData(response, query);
    res.json({ ...formattedRes });
  }
  
  module.exports = mockSearch;
  