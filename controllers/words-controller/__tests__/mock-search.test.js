const HttpError = require('../../../models/http-error');
const axios = require('axios');
const mockSearch = require('../mock-search');
const searchRes = require('./mocks/search-resp.json');


jest.mock('axios');

const next = jest.fn();
const json = jest.fn();
const req = { params: { query: 'shoal' } };
const get = jest.fn();

process.env.AUDIO_ENDPOINT =  "https://media.merriam-webster.com/soundc11";

describe('mock search', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    json.mockClear();
  });
  it('should not call axios', () => {
    axios.get.mockImplementation(get);
    mockSearch(req, { json }, next);
    expect(get).toHaveBeenCalledTimes(0);
    expect(json).toHaveBeenCalledWith(searchRes);
  });
  it('should handle unmockable query', () => {
    axios.get.mockImplementation(get);
    mockSearch({ params: { query: 'bad' } }, { json }, next);
    expect(next).toHaveBeenCalledWith(new HttpError('mock search wordks only with words: shoal, ball, court, demure, doll, hit, rubber, wot.'));
  });
});
