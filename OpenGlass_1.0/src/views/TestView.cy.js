import TestView from './TestView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<TestView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(TestView)
  })
})