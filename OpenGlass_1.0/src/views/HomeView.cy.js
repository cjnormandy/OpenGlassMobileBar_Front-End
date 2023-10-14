import HomeView from './HomeView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<HomeView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(HomeView)
  })
})