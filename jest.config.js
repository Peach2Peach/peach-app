module.exports = {
  rootDir: "./",
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  clearMocks: true,
  collectCoverage: false,
  coverageProvider: "v8",
  coverageReporters: ["lcov", "text-summary"],
  testPathIgnorePatterns: ["<rootDir>/peach-api"],
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|@react-native-community|react-native-form-validator|react-native-permissions|react-native-shadow-2|bdk-rn|react-native-parsed-text|react-native-reanimated|react-native-reanimated-carousel|react-native-url-polyfill|react-native-camera)/)",
  ],
  setupFiles: ["./tests/unit/prepare.ts", "dotenv/config"],
  moduleNameMapper: {
    "\\.(ttf|woff|woff2|eot|otf)$": "jest-transform-stub",
    "\\.(svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  moduleDirectories: ["node_modules", "./tests/unit/helpers"],
  coveragePathIgnorePatterns: ["/node_modules/", "src/views/TestView"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/views/TestView/**/*",
  ],
};
