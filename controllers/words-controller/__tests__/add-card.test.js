const WordCard = require('../../../models/word-cards');
const validator = require('express-validator');
const User = require('../../../models/user');
const Score = require('../../../models/score');
const addCard = require('../add-card');
const HttpError = require('../../../models/http-error');

jest.mock('../../../models/word-cards');
jest.mock('../../../models/user');
jest.mock('../../../models/score');
jest.mock('express-validator');

const next = jest.fn();
const json = jest.fn();
const req = {
  userData: { userId: '0' },
  body: { name: 'cardName', defs: ['def1', 'def2'] },
};
const save = jest.fn();
const status = () => {
  return { json };
};

describe('addCard', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle validation errors', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => false };
    });
    await addCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('invalid inputs passed, please check your data', 422)
    );
  });
  it('should handle server error', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findOne.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await addCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('fetching card failed, please try again', 500)
    );
  });
  it('should handle existing card', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findOne.mockImplementation(() => {
      return {};
    });
    await addCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(`card with name cardName has been already added`),
      422
    );
  });
  it('should handle existing card2', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findOne.mockImplementation(jest.fn);
    User.findOne.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await addCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(`card with name cardName has been already added`),
      422
    );
  });
  it('should handle server error while user fetching', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findOne.mockImplementation(() => {
      return null;
    });
    User.findById.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await addCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('fetching user failed, please try again', 500)
    );
  });
  it('should handle user absence', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findOne.mockImplementation(() => {
      return null;
    });
    User.findById.mockImplementation(() => {
      return null;
    });
    await addCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('could not find user with id 0', 404)
    );
  });
  it('handle card creation error', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findOne.mockImplementation(() => {
      return null;
    });
    User.findById.mockImplementation(() => {
      return { save: jest.fn() };
    });
    await addCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('creating card failed, please try again', 500)
    );
  });
  it('create card correctly', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findOne.mockImplementation(() => {
      return null;
    });
    User.findById.mockImplementation(() => {
      return { save, wordCards: [] };
    });
    Score.mockImplementation((data) => {
      return { ...data, save };
    });
    WordCard.mockImplementation((data) => {
      return { ...data, save };
    });
    WordCard.startSession.mockImplementation(() => ({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
    }));
    await addCard(req, { json, status }, next);
    expect(save).toHaveBeenCalledTimes(3);
    expect(json).toHaveBeenCalledWith({ messsage: 'card created' });
  });
});
