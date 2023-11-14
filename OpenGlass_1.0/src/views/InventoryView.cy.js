import InventoryView from './InventoryView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<InventoryView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(InventoryView)
  })
})