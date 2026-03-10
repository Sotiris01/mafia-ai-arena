/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Only run Phase 1/2 tests (utils + state) until Phase 3+ modules are implemented
  testMatch: ["**/__tests__/(utils|state)/**/*.test.ts"],
};
