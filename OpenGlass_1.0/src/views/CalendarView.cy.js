import CalendarView from './CalendarView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<CalendarView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(CalendarView)
  })
})