import EventsView from './EventsView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<EventsView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(EventsViews)
  })
})