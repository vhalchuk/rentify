import baseConfig from './jest.config'

export default {
  ...baseConfig, // Include your base Jest configuration
  testMatch: ['**/__tests__/**/*.integration.test.{ts,tsx}'], // Run only integration tests
  globalSetup: '<rootDir>/src/app/integration-tests/global-setup.ts', // Setup script for integration tests
  globalTeardown: '<rootDir>/src/app/integration-tests/global-teardown.ts', // Teardown script for integration tests
}
