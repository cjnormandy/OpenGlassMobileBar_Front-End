import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
  }),
  getters: {
    isAuthenticated() {
        console.log('CJ this is user from getter ', !!this.user)
        return !!this.user;
    }
  },
  actions: {
    login(email, password) {
        const staticUser = 'test@test.com';
        const staticPassword = 'pass';
        if (email === staticUser && password === staticPassword) {
            this.user = { email };
            return true;
        } else {
            return false;
        }
    },
  },
});
