/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  maxWorkers: 1,
  testEnvironment: "./environment",
  testTimeout: 120000,
  rootDir: "../..",
  testMatch: ["<rootDir>/tests/e2e/**/*.e2e.test.js"],
  globalSetup: "detox/runners/jest/globalSetup",
  globalTeardown: "detox/runners/jest/globalTeardown",
  reporters: ["detox/runners/jest/reporter"],
  testEnvironment: "detox/runners/jest/testEnvironment",
  verbose: true,
};
