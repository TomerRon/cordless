import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts'],
  coveragePathIgnorePatterns: [
    '/dist/',
    '/node_modules/',
    '/src/index.ts',
    '/jest.config.ts',
  ],
  coverageReporters: ['text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}

export default config
