module.exports = {
  collectCoverageFrom: ['controllers/**/*.js', 'middleware/**/*.js'],
  coveragePathIgnorePatterns: ['__tests__', 'node_modules'],
  testMatch: ['**/__tests__/**/*.test.js'],
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      lines: 80,
      functions: 80,
    },
    'controllers/**/*.js': {
      branches: 50,
      lines: 80,
      functions: 80,
      statements: -10,
    },
    'middleware/**/*.js': {
      branches: 50,
      lines: 80,
      functions: 80,
      statements: -10,
    },
  },
};
