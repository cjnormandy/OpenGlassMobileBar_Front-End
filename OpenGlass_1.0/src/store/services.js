import { defineStore } from 'pinia';
import axios from 'axios';

export const useServiceStore = defineStore({
  id: 'services',
  state: () => ({
    services: [],
    token: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    async getServices() {
      if (this.services.length) return;
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3000/Services');
        this.services = response.data;
        this.isLoading = false;
        return true;
      } catch (error) {
        console.error('Failed to get services:', error.response ? error.response.data : error.message);
        this.error = error.response ? error.response.data : error.message;
        this.isLoading = false;
        return false;
      }
    }
  },
});
