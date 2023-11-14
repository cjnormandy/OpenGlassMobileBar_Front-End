import ServicesView from './ServicesView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<ServicesView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(ServicesView)
  })
})