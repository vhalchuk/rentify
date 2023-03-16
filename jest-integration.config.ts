import baseConfig from './jest.config'

export default {
  ...baseConfig, // Include your base Jest configuration
  testMatch: ['**/__tests__/**/*.integration.test.{ts,tsx}'], // Run only integration tests
  globalSetup: '<rootDir>/src/app/integrationTests/globalSetup.ts', // Setup script for integration tests
  globalTeardown: '<rootDir>/src/app/integrationTests/globalTeardown.ts', // Teardown script for integration tests
}
