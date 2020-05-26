// const mongoose = require('mongoose');
const WordCard = require('../../../models/word-cards');
const validator = require('express-validator');
const deleteCard = require('../delete-card');
const HttpError = require('../../../models/http-error');

jest.mock('../../../models/word-cards');
jest.mock('express-validator');

const next = jest.fn();
const json = jest.fn();
const req = {
  userData: { userId: '0' },
  params: { cardId: '0' },
};
const save = jest.fn();
const remove = jest.fn();

describe('deleteCard', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle validation errors', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => false };
    });
    await deleteCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('invalid inputs passed, please check your data', 422)
    );
  });
  it('should handle server error', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findById.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await deleteCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('fetching card failed, please try again', 500)
    );
  });
  it('should handle card absence', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findById.mockImplementation(() => {
      return null;
    });
    await deleteCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('could not find card with id 0', 404)
    );
  });
  it('should not delete card that belongs to enother user', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findById.mockImplementation(() => ({
      populate: () => ({
        populate: () => ({
          user: {
            id: '3',
          },
        }),
      }),
    }));
    await deleteCard(req, { json }, next);

    expect(next).toHaveBeenCalledWith(
      new HttpError('card 0 belongs another user you cannot delete it', 403)
    );
  });
  it('handle card deletion error', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    const startTransaction = jest.fn();
    const commitTransaction = jest.fn();
    WordCard.startSession.mockImplementation(() => ({
      startTransaction,
      commitTransaction,
    }));
    WordCard.findById.mockImplementation(() => ({
      populate: () => ({
        populate: () => ({
          user: {
            id: '0',
            wordCards: {
              pull: () => {
                throw new Error('dummy error');
              },
            },
            save,
          },
          score: {
            remove,
          },
          remove,
        }),
      }),
    }));
    await deleteCard(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('deleting card failed, please try again', 500)
    );
  });
  it('should delete card correctly', async () => {
    const startTransaction = jest.fn();
    const commitTransaction = jest.fn();
    const pull = jest.fn();
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    WordCard.findById.mockImplementation(() => ({
      populate: () => ({
        populate: () => ({
          user: {
            id: '0',
            wordCards: { pull },
            save,
          },
          score: {
            remove,
          },
          remove,
        }),
      }),
    }));

    WordCard.startSession.mockImplementation(() => ({
      startTransaction,
      commitTransaction,
    }));
    const status = () => {
      return { json };
    };

    await deleteCard(req, { json, status }, next);
    expect(startTransaction).toHaveBeenCalledTimes(1);
    expect(commitTransaction).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(3);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenCalledWith({ message: 'card removed' });
  });
});
