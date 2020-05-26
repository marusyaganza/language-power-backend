const User = require('../../../models/user');
const HttpError = require('../../../models/http-error');
const getUsers = require('../get-users');

jest.mock('../../../models/user');
jest.mock('express-validator');

const next = jest.fn();
const json = jest.fn();
const req = {};

describe('getUsers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle null result', async () => {
    User.find.mockReturnValue(null);
    await getUsers(req, { json }, next);
    expect(next).toHaveBeenCalledWith(new HttpError('could finds users', 404));
  });
  it('should handle fetching error', async () => {
    User.find.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await getUsers(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(`fetching users failed, please try later`, 500)
    );
  });
  it('should return users', async () => {
    User.find.mockReturnValue([
      {
        toObject: () => {
          return {};
        },
      },
    ]);
    await getUsers(req, { json }, next);
    expect(json).toHaveBeenCalledWith({ users: [{}] });
  });
  it('should handle no users case', async () => {
    User.find.mockReturnValue([]);
    await getUsers(req, { json }, next);
    expect(json).toHaveBeenCalledWith({ users: [] });
  });
});
