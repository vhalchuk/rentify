import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest/presets/js-with-ts',
  setupFiles: ['dotenv/config'],
  transform: {
    '^.+\\.mjs$': 'ts-jest',
  },
  roots: ['<rootDir>'],
  // The naming convention for test files
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}
