const ignorePatterns = ["<rootDir>/dist/", "<rootDir>/node_modules/", "<rootDir>/node_modules.nosync/", "/test-helper/", "/__test__/"];

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
  coverageThreshold: { global: { branches: 100, functions: 100, lines: 100, statements: 100 } },
  modulePathIgnorePatterns: ["<rootDir>/node_modules.nosync/"],
};
