import baseConfig from './jest.config'

export default {
  ...baseConfig, // Include your base Jest configuration
  testMatch: ['**/__tests__/**/*.integration.test.{ts,tsx}'], // Run only integration tests
}
