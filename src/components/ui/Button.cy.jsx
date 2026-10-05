import { Button } from './Button'

describe('<Button />', () => {
  it('renders the UI scaffold component', () => {
    cy.mount(<Button />)
    cy.contains('Button').should('be.visible')
  })
})
