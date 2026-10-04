import { Button } from './Button'

describe('<Button />', () => {
  it('renders an accessible action button', () => {
    cy.mount(<Button>Зберегти зміни</Button>)
    cy.contains('Зберегти зміни').should('have.attr', 'type', 'button')
  })
})
