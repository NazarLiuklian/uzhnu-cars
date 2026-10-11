describe('application navigation', () => {
  beforeEach(() => cy.visit('/'))

  it('opens the catalog and navigates to statistics', () => {
    cy.contains('Каталог').should('be.visible')
    cy.contains('Статистика').click()
    cy.url().should('include', '/stats')
    cy.contains('Аналітика автопарку УжНУ').should('be.visible')
  })

  it('navigates through guest redirect and login', () => {
    cy.contains('Додати авто').click()
    cy.contains('Потрібна авторизація').should('be.visible')
    cy.contains('Перейти до авторизації →').click()
    cy.contains('Вхід в систему').should('be.visible')
    cy.contains('Увійти та продовжити →').click()
    cy.contains('Запропонувати авто викладача').should('be.visible')
  })
})
