
describe('Game Timer and State Management', () => {
  beforeEach(() => {
    // Intercepter les requêtes API pour simuler Firebase et les jeux
    cy.intercept('GET', '/api/currentGame', {
      statusCode: 200,
      body: {
        currentRow: 1,
        currentColumn: 1,
        word: 'MANGO',
        attempts: [],
        cellValues: {},
        cellStyles: {},
        isGameOver: false,
        time: 0,
      },
    }).as('loadCurrentGame');

    cy.intercept('POST', '/api/saveCurrentGame', {
      statusCode: 200,
      body: { success: true },
    }).as('saveCurrentGame');

    // Visitez la page du jeu
    cy.visit('/game');
  });

  it('Should display and decrement the timer correctly', () => {
    cy.get('[data-cy=timer]')
      .should('exist')
      .contains(/^10:00$/); // Vérifie que le timer commence à 10 minutes

    // Simulez une attente de 5 secondes et vérifiez la mise à jour
    cy.wait(5000);
    cy.get('[data-cy=timer]').contains(/^09:55$/);
  });

  it('Should save game state when navigating away', () => {
    // Simulez une interaction avec la grille
    cy.get('[data-cy=word-grid]')
      .should('exist')
      .type('MONEY{enter}'); // Soumet une tentative de mot

    // Naviguez hors de la page
    cy.get('[data-cy=nav-home]').click();

    // Vérifiez que l'état du jeu a été sauvegardé
    cy.wait('@saveCurrentGame').its('request.body').should((body) => {
      expect(body.currentRow).to.equal(2); // Row should have advanced
      expect(body.attempts).to.have.length(1); // 1 attempt made
      expect(body.time).to.be.greaterThan(0); // Timer recorded
    });
  });

  it('Should restore the game state on reload', () => {
    // Rechargez la page pour vérifier la restauration de l'état
    cy.reload();
    cy.wait('@loadCurrentGame');

    // Vérifiez que les données sont correctement restaurées
    cy.get('[data-cy=word-grid]')
      .should('exist')
      .find('[data-cy=cell]')
      .each(($cell) => {
        // Les cellules doivent refléter les valeurs restaurées
        expect($cell.text()).to.be.oneOf(['M', 'O', 'N', 'E', 'Y', '']);
      });

    // Vérifiez que le timer est positionné correctement
    cy.get('[data-cy=timer]').should('exist').contains(/^09:55$/);
  });

  it('Should handle game over correctly', () => {
    // Simulez la fin du jeu (temps écoulé)
    cy.get('[data-cy=timer]').invoke('text', '00:00');
    cy.get('[data-cy=game-over]').should('exist').contains('Temps écoulé !');

    // Vérifiez que l'état final est sauvegardé
    cy.wait('@saveCurrentGame').its('request.body').should((body) => {
      expect(body.isGameOver).to.be.true;
    });
  });

  it('Should pause and resume the timer correctly', () => {
    // Pausez le timer
    cy.get('[data-cy=pause-button]').click();
    cy.wait(2000); // Attendez 2 secondes
    cy.get('[data-cy=timer]').invoke('text').should('equal', '09:58'); // Le temps ne devrait pas avoir changé

    // Reprenez le timer
    cy.get('[data-cy=resume-button]').click();
    cy.wait(2000);
    cy.get('[data-cy=timer]').contains(/^09:56$/); // Le temps devrait continuer à diminuer
  });
});
