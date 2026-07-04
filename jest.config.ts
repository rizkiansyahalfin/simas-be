import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",

  testEnvironment: "node",

  roots: [
    "<rootDir>/src"
  ],

  testMatch: [
    "**/*.spec.ts"
  ],

  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup.ts"
  ],

  moduleFileExtensions: [
    "ts",
    "js",
    "json"
  ],

  collectCoverage: true,

  collectCoverageFrom: [
    "src/modules/auth/**/*.ts",
    "src/modules/finance/**/*.ts",
    "src/modules/donations/**/*.ts",

    "!**/*.controller.ts",
    "!**/*.route.ts",
    "!**/*.validation.ts",
    "!**/*.type.ts",
    "!**/*.pdf.ts",
    "!**/*.excel.ts"
  ],

  coverageDirectory: "coverage",

  clearMocks: true,

  resetMocks: true,

  restoreMocks: true
}

export default config