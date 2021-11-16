describe('Make sure our todo list app is working well', () => {
    it('Test that we can open a browser and load our app', () => {
        cy.visit("http://127.0.0.1:4000");
        cy.wait(5000); // /!\ /!\ /!\ USELESS LINE HERE <---
        // Cypress always wait before doing the next action
        // Please, do not copy that line for the rest of the TP.
    })
})