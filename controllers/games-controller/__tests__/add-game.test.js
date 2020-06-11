const Game = require('../../../models/game');
const HttpError = require('../../../models/http-error');
const addGame = require('../add-game');

jest.mock('../../../models/game');

const next = jest.fn();
const json = jest.fn();
const save = jest.fn();
const req = {
  body: { name: 'game' },
};

describe('add-game', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle game creation error', async () => {
    Game.mockReturnValueOnce({
      save: () => {
        throw new Error('dummy error');
      },
    });
    await addGame(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('creating game failed, please try again', 500)
    );
  });
  it('should save created game', async () => {
    Game.mockReturnValueOnce({ save, toObject: jest.fn() });
    await addGame(req, { json }, next);
    expect(save).toHaveBeenCalled();
  });
  it('should create game', async () => {
    Game.mockImplementation((data) => {
      return { save, toObject: () => data };
    });
    await addGame(req, { json }, next);
    expect(json).toHaveBeenCalled();
  });
});
