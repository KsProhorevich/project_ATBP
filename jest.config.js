module.exports = {
  testMatch: [
    "**/*.test.js"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/e2e/",
    "/tests/"   // ← важно!
  ],
};