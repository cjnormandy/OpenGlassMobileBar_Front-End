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
      },
      async addDrink(drinkData) {
        try {
          const formData = new FormData();
          formData.append('name', drinkData.name);
          formData.append('type', drinkData.type);
          formData.append('desc', drinkData.description);
          formData.append('image', drinkData.image);
          formData.append('alcohol', drinkData.alcohol);
          formData.append('ingredients', JSON.stringify(drinkData.ingredients));
  
          const response = await axios.post('http://localhost:3000/addDrink', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          // Optionally, refresh the drinks list after adding
          await this.getDrinks();
  
          return response.data; // or true, depending on what you want to return
        } catch (error) {
          console.error('Failed to add drink:', error.response ? error.response.data : error.message);
          return false;
        }
      },
  },
});
