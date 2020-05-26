const HttpError = require('../../../models/http-error');
// const { formatData } = require('../../helpers');
const axios = require('axios');
const search = require('../search');
const dictRes = require('./mocks/search-req.json');
const searchRes = require('./mocks/search-resp.json');

jest.mock('axios');

const next = jest.fn();
const json = jest.fn();
const req = { params: { query: 'shoal' } };
const get = jest.fn();

process.env.SEARC_ENDPOINT = 'https//test.com';
process.env.MW_KEY = 'myKey';

describe('search', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle search error', () => {
    axios.get.mockImplementation(() => {
      throw new Error('dummy error');
    });
    search(req, { json }, next);
    expect(next).toHaveBeenCalledWith(new HttpError('word search failed', 500));
  });
  it('should use correct url', () => {
    axios.get.mockImplementation(get);
    search(req, { json }, next);
    expect(get).toHaveBeenCalledWith('https//test.com/shoal?key=myKey');
  });
  it('should return search result', () => {
    axios.get.mockResolvedValue({ data: dictRes });
    search(req, { json }, next);
    expect(json).toHaveBeenCalledWith({});
    // expect(json).toHaveBeenCalledWith(searchRes);
  });
});
