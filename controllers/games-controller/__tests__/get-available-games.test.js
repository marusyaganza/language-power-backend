const Game = require('../../../models/game');
const HttpError = require('../../../models/http-error');
const getGames = require('../get-available-gemes');

jest.mock('../../../models/game');

const next = jest.fn();
const json = jest.fn();
const req = {};

describe('get-available-gemes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle games fetching error', async () => {
    Game.find.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await getGames(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('fetching games failed, please try again', 500)
    );
  });
  it('should handle no games case', async () => {
    Game.find.mockResolvedValue(null);
    await getGames(req, { json }, next);
    expect(json).toHaveBeenCalledWith({ message: 'no games available' });
  });
  it('should return games', async () => {
    Game.find.mockImplementation(() => [{ toObject: () => ({ id: '0' }) }]);
    await getGames(req, { json }, next);
    expect(json).toHaveBeenCalledWith([{ id: '0' }]);
  });
});
