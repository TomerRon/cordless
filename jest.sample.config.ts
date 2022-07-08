import { Config } from '@jest/types'
import baseConfig from './jest.config'

const config: Config.InitialOptions = {
  ...baseConfig,
  rootDir: 'sample',
  transform: {
    '^.+\\.(ts|js)x?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    '/*/index.ts',
    '/*/index.js',
    '/*/jest.config.ts',
  ],
  collectCoverageFrom: ['**/*.ts', '**/*.js'],
  globals: {
    'ts-jest': {
      tsconfig: {
        allowJs: true,
        rootDir: 'sample',
      },
    },
  },
}

export default config
