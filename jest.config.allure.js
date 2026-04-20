module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['allure-jest'],
  reporters: [
    'default',
    ['allure-jest', {
      resultsDir: './allure-results',
      cleanResultsDir: true
    }]
  ]
};