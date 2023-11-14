import WelcomeView from './WelcomeView.vue'
import { mount } from 'cypress/vue'
import { createPinia } from 'pinia';

Cypress.Commands.add('mount', mount);

describe('<WelcomeView />', () => {
  it('renders', () => {
    // Create a new instance of Pinia
    const pinia = createPinia();

    // see: https://on.cypress.io/mounting-vue
    cy.mount(WelcomeView, { global: { plugins: [pinia] } })
  })
})