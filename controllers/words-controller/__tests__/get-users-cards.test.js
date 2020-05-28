const WordCard = require('../../../models/word-cards');

const getUsersCards = require('../get-users-cards');
const HttpError = require('../../../models/http-error');

jest.mock('../../../models/word-cards');

const next = jest.fn();
const json = jest.fn();
const toObject = () => {
  return {};
};
const req = { userData: { userId: '0' } };

describe('getUsersCards should return user cards', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should return user cards', async () => {
    WordCard.find.mockResolvedValue([{ toObject }, { toObject }]);
    await getUsersCards(req, { json }, next);
    expect(json).toHaveBeenCalledWith([{}, {}]);
  });
  it('should handle server error', async () => {
    WordCard.find.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await getUsersCards(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('card search failed, please try again', 500)
    );
  });
  it('should handle null user cards', async () => {
    WordCard.find.mockResolvedValue(null);
    await getUsersCards(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(`a user with id 0 can not be found`, 404)
    );
  });
});
