import AboutView from './AboutView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<AboutView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(AboutView)
  })
})