import { defineStore } from 'pinia';
import axios from 'axios';

export const useDrinkStore = defineStore({
  id: 'drinks',
  state: () => ({
      drinks: null,
      token: null,
  }),
  actions: {
      async getDrinks() {
          try {
              const response = await axios.get('http://localhost:3000/drinks');
              this.drinks = response.data;
              return true;
          } catch (error) {
              console.error('Failed to get drinks:', error.response ? error.response.data : error.message);
              return false;
          }
      }
  },
});
