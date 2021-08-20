/*
 * Integration tests
 */

module.exports = {
    rootDir: './',
    moduleFileExtensions: ['js'],
    testMatch: ['**/e2e/tests/*.integration.js'],
    modulePathIgnorePatterns: ['node_modules', 'src/types'],
    setupFilesAfterEnv: ['<rootDir>/e2e/jest.setup.js', '<rootDir>/e2e/common.setup.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    collectCoverage: true,
    coverageDirectory: './coverage/',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/__tests__/',
        '/__fixtures__/',
    ],
    // collectCoverageFrom: ['./src/js/**/*.{js}', '!**/node_modules/**'],
    verbose: true,
    bail: true,
};
