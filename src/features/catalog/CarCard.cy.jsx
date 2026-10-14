import { CarCard } from './CarCard'

describe('<CarCard />', () => {
  it('renders the catalog feature scaffold', () => {
    cy.mount(<CarCard />)
    cy.contains('CarCard').should('be.visible')
  })
})
