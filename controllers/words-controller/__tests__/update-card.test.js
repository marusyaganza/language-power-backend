const WordCard = require('../../../models/word-cards');
const User = require('../../../models/user');
const updateCard = require('../update-card');
const HttpError = require('../../../models/http-error');

jest.mock('../../../models/word-cards');
jest.mock('../../../models/user');
jest.mock('../../../models/score');
jest.mock('express-validator');

const next = jest.fn();
const json = jest.fn();
const req = {
  userData: { userId: '0' },
  params: { cardId: '0' },
  body: { examples: ['example'], defs: ['def1', 'def2'] },
};

describe('updateCard', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle server error', async () => {
    WordCard.findById.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await updateCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('fetching card failed, please try again', 500)
    );
  });
  // TODO fix this test
  it.skip('should handle existing card abcense', async () => {
    WordCard.findById.mockImplementation(() => {
      return null;
    });
    await updateCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(`card is not found`, 404),
    );
  });
  it('should handle existing card2', async () => {
    WordCard.findById.mockImplementation(jest.fn);
    User.findById.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await updateCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('fetching card failed, please try again', 500));
  });
  it('should handle empty defs', async () => {
    await updateCard({...req, body: {defs: []}}, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('invalid input: defs array can\'t be empty', 422)
    );
  });
});
