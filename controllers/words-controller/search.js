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
      console.error(err);
    }
    next(new HttpError('word search failed', 500));
  }
  res.json({ ...formattedRes });
}

module.exports = search;
