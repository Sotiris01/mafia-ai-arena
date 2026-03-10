/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      { tsconfig: { jsx: "react-jsx" } },
    ],
  },
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],
  // Scaffold-only test files (no tests yet) — un-ignore as they get implemented
  testPathIgnorePatterns: [
    "/node_modules/",
    "__tests__/ai/",
    "__tests__/engine/FullMoonEngine",
    "__tests__/engine/NightEchoEngine",
    "__tests__/engine/PhaseManager",
    "__tests__/engine/ResolutionEngine",
    "__tests__/engine/WinChecker",
  ],
};
