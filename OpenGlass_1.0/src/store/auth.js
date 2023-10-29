import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    token: null,
  }),
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
                username: email,  // Assuming the backend expects a field named 'username'
                password: password,
            });
            
            // Assuming a successful login will return a token in the response body
            this.user = { email };  // Update the user state
            this.token = response.data.token;  // Update the token state

            return true;  // Login successful
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            return false;  // Login failed
        }
    },
  },
});
