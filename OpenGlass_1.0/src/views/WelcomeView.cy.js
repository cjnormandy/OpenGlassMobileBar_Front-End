import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from 'cypress/vue'
import WelcomeView from './WelcomeView.vue'

Cypress.Commands.add('mount', mount);

describe('<WelcomeView /> Component', () => {
  beforeEach(() => {
    // Mock router
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: WelcomeView }],
    });

    // Mount the component with the mock router
    cy.mount(WelcomeView, {
      global: {
        plugins: [router],
      },
    });
  });

  it('renders correctly', () => {
    // Your test assertions here
  });
});
