module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.(ts|tsx|js)'],
  moduleNameMapper: {
    '^@amazon-devices/react-native-kepler$': '<rootDir>/tests/mocks/amazon-kepler-mock.js',
    '^@amazon-devices/kepler-performance-api$': '<rootDir>/tests/mocks/amazon-perf-mock.js',
    '^@amazon-devices/webview$': '<rootDir>/tests/mocks/amazon-webview-mock.js',
    '^react-native$': '<rootDir>/tests/mocks/react-native-mock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageReporters: ['text', 'lcov', 'clover']
};
