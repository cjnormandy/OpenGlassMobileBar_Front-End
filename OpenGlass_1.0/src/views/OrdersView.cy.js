import OrdersView from './OrdersView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<OrdersView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(OrdersView)
  })
})