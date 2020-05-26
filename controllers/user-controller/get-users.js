const User = require('../../models/user');
const HttpError = require('../../models/http-error');

async function getUsers(req, res, next) {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError(`fetching users failed, please try later`, 500));
  }
  if (!users) {
    return next(new HttpError('could finds users', 404));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}

module.exports = getUsers;
