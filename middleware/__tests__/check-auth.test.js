const jwt = require('jsonwebtoken');
const checkAuth = require('../check-auth');
const HttpError = require('../../models/http-error');

jest.mock('jsonwebtoken');

const next = jest.fn();
const json = jest.fn();
const req = {
  headers: { authorization: 'Bearer sometoken' },
};

process.env.TOKEN_KEY = 'key';

describe('check-auth', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle options req', async () => {
    await checkAuth(
      {
        method: 'OPTIONS',
      },
      { json },
      next
    );
    expect(next).toHaveBeenCalledWith();
  });
  it('should handle handle token error', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('token error');
    });
    await checkAuth(req, { json }, next);
    expect(next).toHaveBeenCalledWith(new HttpError('Auth failed', 401));
  });
  it('should handle token absence', async () => {
    jwt.verify.mockReturnValueOnce(null);
    await checkAuth(req, { json }, next);
    expect(next).toHaveBeenCalledWith(new HttpError('Auth failed', 401));
  });
  it('should set userData and continue', async () => {
    jwt.verify.mockReturnValueOnce({ userId: 'id1' });
    await checkAuth(req, { json }, next);
    expect(req.userData).toEqual({ userId: 'id1' });
    expect(next).toHaveBeenCalledWith();
  });
});
