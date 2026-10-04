describe('navigation', () => {
  beforeEach(() => cy.visit('/'))

  it('opens the catalog and navigates to statistics', () => {
    cy.contains('Каталог авто').should('be.visible')
    cy.contains('Статистика').click()
    cy.url().should('include', '/stats')
    cy.contains('Статистика автопарку').should('be.visible')
  })

  it('guards the add car form and opens it after login', () => {
    cy.contains('Додати авто').click()
    cy.url().should('include', '/add-car')
    cy.contains('Потрібна авторизація').should('be.visible')
    cy.contains('Увійти').click()
    cy.get('#email').type('student@uzhnu.edu.ua')
    cy.get('#password').type('password')
    cy.contains('Увійти до кабінету').click()
    cy.url().should('include', '/add-car')
    cy.contains('Анкета автомобіля').should('be.visible')
  })

  it('adds a submitted car to proposal history', () => {
    cy.visit('/auth')
    cy.get('#email').type('student@uzhnu.edu.ua')
    cy.get('#password').type('password')
    cy.contains('Увійти до кабінету').click()
    cy.get('#teacher').type('Бучук Р. Ю.')
    cy.get('select').first().select('ІПЗ')
    cy.get('#brand').type('BMW')
    cy.get('#model').type('3 Series')
    cy.get('#year').type('2019')
    cy.contains('Відправити анкету на модерацію').click()
    cy.get('[data-testid="submission-item"]')
      .first()
      .should('contain', 'BMW 3 Series · 2019')
      .and('contain', 'На модерації')
  })
})
