import ServicesListView from './ServicesListView.vue'
import { mount } from 'cypress/vue'
import { createPinia } from 'pinia';

Cypress.Commands.add('mount', mount);

describe('<ServicesListView />', () => {
  it('renders', () => {
    // Create a new instance of Pinia
    const pinia = createPinia();

    // see: https://on.cypress.io/mounting-vue
    cy.mount(ServicesListView, { global: { plugins: [pinia] } })
  })
})