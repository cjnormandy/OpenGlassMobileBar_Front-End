import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore({
  id: 'drinks',
  state: () => ({
    drinks: null,
    token: null,
  }),
  actions: {
    async getDrinks() {
        try {
            const response = await axios.get('http://localhost:3000/drinks')
            console.log('CJ here are the drinks: ', response.data)
        } catch (error) {
            console.error('Failed to get drinks:', error.response ? error.response.data : error.message);
        }
    }
  },
});
