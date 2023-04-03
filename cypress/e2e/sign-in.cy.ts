describe('Sign In', () => {
  before(() => {
    cy.seedUser()
  })

  it('should successfully sign in with valid credentials', () => {
    cy.visit('/dashboard') // Visit the dashboard page
    cy.url().should('include', '/api/auth/signin') // Verify that we are redirected to the signin page
    // Signing in with credentials is available only for demo user and testing
    cy.get('input[type="email"]').type('test@test.com') // Type in email address
    cy.get('input[type="password"]').type('test') // Type in password
    cy.contains('button', 'Sign in with Credentials').click() // Click the submit button
    cy.url().should('include', '/') // Verify that we are redirected back to the dashboard page
    cy.get('button[aria-label="Open user menu"]')
  })
})

export {}
