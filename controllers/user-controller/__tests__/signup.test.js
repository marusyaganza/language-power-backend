const validator = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const singup = require('../signup');
const User = require('../../../models/user');
const HttpError = require('../../../models/http-error');

jest.mock('../../../models/user');
jest.mock('express-validator');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
const next = jest.fn();
const json = jest.fn();
const status = () => {
  return { json };
};
const req = {
  userData: { userId: '0' },
  body: { email: 'test@test.com', password: 'password&6' },
};
const sign = jest.fn();
process.env.TOKEN_KEY = 'key';
process.env.mode = 'dev';
const hash = 'some_hash';

describe('sign up', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle validation errors', async () => {
    validator.validationResult.mockImplementation(() => {
      return { isEmpty: () => false };
    });
    await singup(req, { json }, next);
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
    await singup(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(`sign up failed, please try later`, 500)
    );
  });
  it('should handle existing user', async () => {
    validator.validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockReturnValue({ id: 'id1' });
    await singup(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(
        'could not signup user, the email test@test.com is already taken',
        401
      )
    );
  });

  it('should handle encryption error', async () => {
    validator.validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockReturnValue(null);
    bcrypt.hash.mockImplementation(() => {
      throw new Error('encryption error');
    });
    await singup(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('Could not create user, pleate try again', 500)
    );
  });

  it('should handle token generation error', async () => {
    validator.validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockReturnValue(null);
    bcrypt.hash.mockReturnValue(hash);
    jwt.sign.mockImplementation(() => {
      throw new Error('token error');
    });

    await singup(req, { json, status }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('Login failed, please try again', 500)
    );
  });
  it('should generate correct token', async () => {
    validator.validationResult.mockReturnValue({ isEmpty: () => true });
    User.mockReturnValue({ id: 'id1', save: sign });
    User.findOne.mockReturnValue(null);
    bcrypt.hash.mockReturnValue(hash);
    jwt.sign.mockImplementation(sign);

    await singup(req, { json, status }, next);
    expect(sign).toHaveBeenCalledWith({ userId: 'id1' }, 'key', {
      expiresIn: '1y',
    });
  });
  it('should handle user creation error', async () => {
    validator.validationResult.mockReturnValue({ isEmpty: () => true });
    User.mockReturnValue({
      id: 'id1',
      save: () => {
        throw new Error('dummy error');
      },
    });
    User.findOne.mockReturnValue(null);
    bcrypt.hash.mockReturnValue(hash);
    await singup(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(`sign up failed, please try later`, 500)
    );
  });
  it('should sign up user', async () => {
    validator.validationResult.mockReturnValue({ isEmpty: () => true });
    User.mockReturnValue({ id: 'id1', save: sign });
    User.findOne.mockReturnValue(null);
    bcrypt.hash.mockReturnValue(hash);
    jwt.sign.mockReturnValue('token');
    await singup(req, { json, status }, next);
    expect(json).toHaveBeenCalledWith({ userId: 'id1', token: 'token' });
  });
  it('should not create user in prod mode', async () => {
    process.env.mode = 'prod';
    await singup(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(
        'Sign Up is temporarily unavailable, please try again later',
        503
      )
    );
  });
});
