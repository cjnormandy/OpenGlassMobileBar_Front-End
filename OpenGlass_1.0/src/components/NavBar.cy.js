import NavBar from './NavBar.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<NavBar />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(NavBar)
  })
})