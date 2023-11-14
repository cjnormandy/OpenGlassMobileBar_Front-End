import LoginView from './LoginView.vue'
import { mount } from 'cypress/vue'
import { createPinia } from 'pinia';

Cypress.Commands.add('mount', mount);

describe('<LoginView />', () => {
  it('renders', () => {
    // Create a new instance of Pinia
    const pinia = createPinia();

    // see: https://on.cypress.io/mounting-vue
    cy.mount(LoginView, { global: { plugins: [pinia] } })
  })
})