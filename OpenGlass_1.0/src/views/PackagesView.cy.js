import PackagesView from './PackagesView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<PackagesView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(PackagesView)
  })
})