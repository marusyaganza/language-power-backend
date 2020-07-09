const HttpError = require('../../models/http-error');
const { formatData } = require('../helpers');

const axios = require('axios');
async function search(req, res, next) {
  const { query } = req.params;
  const url = `${process.env.SEARC_ENDPOINT}/${query}?key=${process.env.MW_KEY}`;
  let formattedRes;
  try {
    const response = await axios.get(url);
    formattedRes = formatData(response.data, query);
  } catch (err) {
    if (process.env.mode === 'dev') {
      // TODO use the real logger for development
      console.error(err);
      // TODO delete console log from here and find the way to send error details to Sentry but not to the client
    }
    next(new HttpError('word search failed', 500));
  }
  res.json({ ...formattedRes });
}

module.exports = search;
