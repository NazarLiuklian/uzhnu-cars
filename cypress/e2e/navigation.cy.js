describe('application scaffold navigation', () => {
  beforeEach(() => cy.visit('/'))

  it('opens the catalog and navigates to statistics', () => {
    cy.contains('Каталог').should('be.visible')
    cy.contains('Статистика').click()
    cy.url().should('include', '/stats')
    cy.contains('Статистика').should('be.visible')
  })

  it('navigates through the scaffold pages', () => {
    cy.contains('Додати авто').click()
    cy.contains('Додати авто').should('be.visible')
    cy.contains('Профіль').click()
    cy.contains('Профіль').should('be.visible')
  })
})
