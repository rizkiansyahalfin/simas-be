module.exports = {
  preset: "ts-jest/presets/default-esm",

  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],

    "^.+\\.(js|jsx)$": "babel-jest",
  },

  transformIgnorePatterns: [],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: ["**/*.e2e.test.ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  verbose: true,

  forceExit: true,

  clearMocks: true,
};