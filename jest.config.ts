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

  collectCoverage: true,

  collectCoverageFrom: [

    "src/modules/auth/**/*.ts",

    "src/modules/finance/**/*.ts",

    "src/modules/donation/**/*.ts",

    "src/modules/zis/**/*.ts",

    "!**/*.route.ts",
    "!**/*.type.ts",
    "!**/*.validation.ts"
  ],

  coverageDirectory:
    "coverage",

  clearMocks: true
}

export default config