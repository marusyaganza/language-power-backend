const validator = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const login = require('../login');
const User = require('../../../models/user');
const HttpError = require('../../../models/http-error');

jest.mock('../../../models/user');
jest.mock('express-validator');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
const next = jest.fn();
const json = jest.fn();
const req = {
  userData: { userId: '0' },
  body: { email: 'test@test.com', password: 'password&6' },
};
const sign = jest.fn();
process.env.TOKEN_KEY = 'key';

describe('login', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle validation errors', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => false };
    });
    await login(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('invalid inputs passed, please check your data', 422)
    );
  });
  it('should handle server error', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    User.findOne.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await login(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(`login user failed, please try later`, 500)
    );
  });
  it('should handle undefined user', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    User.findOne.mockImplementation(() => {
      return null;
    });
    await login(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('could not identify user, credentials seems wrong', 401)
    );
  });
  it('should handle wrong password', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    User.findOne.mockImplementation(() => {
      return { password: 'jkdffdj' };
    });
    bcrypt.compare.mockReturnValue(false);
    await login(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('could not identify user, credentials seems wrong', 401)
    );
  });
  it('should handle decription error', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    User.findOne.mockImplementation(() => {
      return { password: 'jkdffdj' };
    });
    bcrypt.compare.mockImplementation(() => {
      throw new Error('decription error');
    });
    await login(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('Login failed, please try again', 500)
    );
  });
  it('should handle token generation error', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    User.findOne.mockImplementation(() => {
      return { password: 'jkdffdj' };
    });
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockImplementation(() => {
      throw new Error('token error');
    });

    await login(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('Login failed, please try again', 500)
    );
  });
  it('should generate correct token', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    User.findOne.mockImplementation(() => {
      return { password: 'jkdffdj', id: 'id1' };
    });
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockImplementation(sign);

    await login(req, { json }, next);
    expect(sign).toHaveBeenCalledWith({ userId: 'id1' }, 'key', {
      expiresIn: '1y',
    });
  });
  it('should login user', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => true };
    });
    User.findOne.mockImplementation(() => {
      return { password: 'jkdffdj', id: 'id1' };
    });
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockReturnValue('token');

    await login(req, { json }, next);
    expect(json).toHaveBeenCalledWith({ userId: 'id1', token: 'token' });
  });
});
