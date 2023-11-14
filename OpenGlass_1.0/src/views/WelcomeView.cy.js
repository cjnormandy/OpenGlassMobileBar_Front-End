import WelcomeView from './WelcomeView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<WelcomeView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(WelcomeView)
  })
})