import NavBar from './NavBar.vue'
import { mount } from 'cypress/vue'
import { createPinia } from 'pinia';

Cypress.Commands.add('mount', mount);

describe('<NavBar />', () => {
  it('renders', () => {
    // Create a new instance of Pinia
    const pinia = createPinia();

    // see: https://on.cypress.io/mounting-vue
    cy.mount(NavBar, { global: { plugins: [pinia] } })
  })
})