import NavBar from './NavBar.vue'

describe('<NavBar />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(NavBar)
  })
})