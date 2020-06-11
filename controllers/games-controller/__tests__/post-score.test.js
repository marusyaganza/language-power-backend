const Score = require('../../../models/score');
const HttpError = require('../../../models/http-error');
const validator = require('express-validator');
const postScore = require('../post-score');

jest.mock('../../../models/score');
jest.mock('express-validator');

const next = jest.fn();
const json = jest.fn();
const save = jest.fn();
const req = {
  body: {
    gameId: 'gameId',
    gameResults: [{ id: 'id1', index: 0, result: 1, cardId: 'card1' }],
  },
  userData: { userId: 'id0' },
};
const status = () => {
  return { json };
};

describe('post-score', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle incorrect inputs', async () => {
    validator.validationResult.mockImplementation(() => ({
      isEmpty: () => false,
    }));
    await postScore(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('invalid inputs passed, please check your data', 422)
    );
  });
  it('should handle score fetching error', async () => {
    validator.validationResult.mockImplementation(() => ({
      isEmpty: () => true,
    }));
    Score.findById.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await postScore(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(
        `fetching score for card card1 failed, please try again`,
        500
      )
    );
  });
  it('should handle score absence', async () => {
    validator.validationResult.mockImplementation(() => ({
      isEmpty: () => true,
    }));
    Score.findById.mockResolvedValue(null);
    await postScore(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('score id1 is not found', 404)
    );
  });
  it('should not work with score from enother user', async () => {
    validator.validationResult.mockImplementation(() => ({
      isEmpty: () => true,
    }));
    Score.findById.mockResolvedValue({
      user: 'id3',
    });
    await postScore(req, { json, status }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('Auth is required for this operation', 403)
    );
  });
  it('should save score', async () => {
    validator.validationResult.mockImplementation(() => ({
      isEmpty: () => true,
    }));
    Score.findById.mockResolvedValue({
      user: 'id0',
      score: { gameId: [0, 0, 0] },
      save,
    });
    await postScore(req, { json, status }, next);
    expect(save).toHaveBeenCalled();
  });
  it('should send response', async () => {
    validator.validationResult.mockImplementation(() => ({
      isEmpty: () => true,
    }));
    Score.findById.mockResolvedValue({
      user: 'id0',
      score: { gameId: [0, 0, 0] },
      save,
    });
    await postScore(req, { json, status }, next);
    expect(json).toHaveBeenCalledWith({ message: 'games results saved' });
  });
  it('should handle error while saving', async () => {
    validator.validationResult.mockImplementation(() => ({
      isEmpty: () => true,
    }));
    Score.findById.mockResolvedValue({
      user: 'id0',
      score: { gameId: [0, 0, 0] },
      save: () => {
        throw new Error('dummy error');
      },
    });
    await postScore(req, { json, status }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('updating score failed, please try again', 500)
    );
  });
});
