<template>
  <div class="absolute inset-x-0 top-40 z-1">
    <!-- Jumbotron -->
    <div class="relative overflow-hidden bg-cover bg-no-repeat bg-center p-12 text-center" style="background-image: url('src/assets/calender_photo.png'); padding-bottom: 20%;">
      <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style="background-color: rgba(0, 0, 0, 0.6)">
        <div class="flex h-full items-center justify-center">
          <div class="text-white">
            <h2 class="mb-4 text-4xl font-semibold">Our Drink Menu</h2>
          </div>
        </div>
      </div>
    </div>
    <!-- Content -->
    <div class="p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Loop through all drinks -->
        <div v-for="drink in drinks" :key="drink.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="bg-cover bg-center h-36 p-4" :style="'background-image: url(' + drink.drink_image + ');'"></div>
          <div class="p-4">
            <h3 class="text-xl font-semibold">{{ drink.drink_name }}</h3>
            <p class="text-gray-600">{{ drink.drink_type }}</p>
            <p class="text-gray-800">{{ drink.drink_description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      drinks: [],
    };
  },

  methods: {
    // Fetch drinks data from the backend
    async fetchDrinks() {
      const backendUrl = 'http://localhost:3000';
      const apiUrl = `${backendUrl}/drinks`;
      try {
      const response = await axios.get(apiUrl);
      this.drinks = response.data;
      console.log('Response from the server:', response.data);
      } catch (error) {
        console.error('Error fetching drinks:', error);
      }
    },
  },

  created() {
    this.fetchDrinks();
  },
};
</script>

<style scoped>
.bg-cover {
  background-size: cover;
}

.bg-center {
  background-position: center;
}
</style>