module.exports = {
  testURL: 'http://localhost/',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tag$': 'riot-jest-transformer'
  }
};
