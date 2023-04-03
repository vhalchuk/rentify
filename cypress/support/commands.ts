Cypress.Commands.add('seedUser', () => {
  cy.exec('npx prisma db seed')
})

declare global {
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable {
      seedUser(): Chainable
    }
  }
}

export {}
