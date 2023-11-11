import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    token: null,
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
      },
    ],
  },
  getters: {
    isAuthenticated() {
        console.log('CJ this is user from getter ', !!this.user)
        return !!this.user;
    }
  },
  actions: {
    async login(email, password) {
        try {
            const response = await axios.post('http://localhost:3000/users/login', {
                username: email,
                password: password,
            });
            
            this.user = { email };
            this.token = response.data.token;

            return true;
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            return false;
        }
    },
  },
});
