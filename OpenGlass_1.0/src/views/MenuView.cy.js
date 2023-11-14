import MenuView from './MenuView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<MenuView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(MenuView)
  })
})