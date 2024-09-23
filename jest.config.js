module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.ts$': '<rootDir>/node_modules/babel-jest'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(ol|@babel|jest-runtime|@terrestris|color-*|query-string|' +
    'decode-uri-component|split-on-first|filter-obj|geostyler-openlayers-parser|geostyler-style))'
  ],
  testRegex: '/src/.*\\.spec.(ts|js)$',
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/model/**/*.{ts,js}',
    '!src/spec/**/*.{ts,js}'
  ],
};
