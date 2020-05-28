module.exports = {
  collectCoverageFrom: ['controllers/**/*.js', 'middleware/**/*.js'],
  coveragePathIgnorePatterns: ['__tests__', 'node_modules'],
  testMatch: ['**/__tests__/**/*.test.js'],
  testEnvironment: 'node',
};
