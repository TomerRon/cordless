import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: false,
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  rootDir: 'e2e',
}

export default config
