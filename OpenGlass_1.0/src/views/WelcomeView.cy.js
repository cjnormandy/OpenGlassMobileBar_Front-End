import WelcomeView from './WelcomeView.vue'
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount);

describe('<WelcomeView /> Component', () => {
  beforeEach(() => {
    // Mount the component before each test
    cy.mount(WelcomeView);
  });

  it('successfully mounts', () => {
    // Check if the component is successfully mounted
    cy.get('.welcome-view').should('exist');
  });

  it('displays the welcome message', () => {
    cy.contains('h1', 'Welcome').should('be.visible');
  });
})