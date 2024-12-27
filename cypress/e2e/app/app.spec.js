describe('Application Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000')
  })

  it('should load the application', () => {
    cy.contains('Démarrer une partie').should('be.visible')
  })

  it('should display the typed word in the grid', () => {
    cy.contains('Démarrer une partie').click()

    cy.get('#cell-1-1').should('be.visible')
    cy.wait(500)

    cy.get('body').type('jante')

    cy.get('#cell-1-1 span').should('have.text', 'J')
    cy.get('#cell-1-2 span').should('have.text', 'A')
    cy.get('#cell-1-3 span').should('have.text', 'N')
    cy.get('#cell-1-4 span').should('have.text', 'T')
    cy.get('#cell-1-5 span').should('have.text', 'E')
  })

  it('should show an error message when typing an invalid word', () => {
    cy.contains('Démarrer une partie').click()

    cy.get('#cell-1-1').should('be.visible')
    cy.wait(500)

    cy.get('body').type('zzzzz')
    cy.get('body').type('{enter}')

    cy.contains("Le mot n'est pas dans la liste").should('be.visible')
  })

  it('should accept the valid word "jante"', () => {
    cy.contains('Démarrer une partie').click()

    cy.get('#cell-1-1').should('be.visible')
    cy.wait(500)

    cy.get('body').type('jante')
    cy.get('body').type('{enter}')

    cy.wait(3000)

    cy.get('#cell-1-1 span').should('have.text', 'J')
    cy.get('#cell-1-2 span').should('have.text', 'A')
    cy.get('#cell-1-3 span').should('have.text', 'N')
    cy.get('#cell-1-4 span').should('have.text', 'T')
    cy.get('#cell-1-5 span').should('have.text', 'E')

    cy.get('body').type('a')
    cy.get('#cell-2-1 span').should('have.text', 'A')
  })

  it('should navigate to defeat page when abandoning the game', () => {
    cy.contains('Démarrer une partie').click()
    cy.contains('Abandonner la partie').click()
    cy.contains('Vous avez abandonné la partie.').should('be.visible')
  })

  it('should display the statistics page', () => {
    cy.contains('Consulter les parties précédentes').click()
    cy.url().should('include', '/history')
    cy.contains('Parties jouées').should('be.visible')
    cy.contains('Tentatives moyennes').should('be.visible')
    cy.contains('Temps de jeu total').should('be.visible')
  })
})
