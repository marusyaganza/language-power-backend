const { formatData } = require('../helpers');

async function mockSearch(req, res) {
    const { query } = req.params;
    let response = require(`./mocks/${query}.json`) || {};
    const formattedRes = formatData(response.data, query);
    res.json({ ...formattedRes });
  }
  
  module.exports = mockSearch;
  