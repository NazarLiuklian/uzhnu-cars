import { CarCard } from './CarCard'

describe('<CarCard />', () => {
  it('renders model, teacher and fuel', () => {
    cy.mount(
      <CarCard
        car={{
          model: 'BMW 3 Series',
          teacher: 'Бучук Р. Ю.',
          department: 'ІПЗ',
          fuel: 'Бензин',
          year: 2019,
          image:
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=60',
        }}
      />,
    )
    cy.get('[data-testid="car-card"]').should('be.visible')
    cy.contains('BMW 3 Series').should('be.visible')
    cy.contains('Бучук Р. Ю.').should('be.visible')
  })
})
