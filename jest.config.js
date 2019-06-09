module.exports = {
  testURL: 'http://localhost/',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.riot$': 'riot-v4-jest-transformer'
  }
};
