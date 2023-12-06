<template>
    <div class="slide-content flex">
        <div class="text-content flex-1">
            <div class="text">
                <div class="title font-semibold">{{ drink.drink_name }}</div>
                <div class="subtitle">{{ drink.drink_type }}</div>
                <div class="p-20">
                    <p class="font-semibold">{{ drink.drink_description }}</p>
                    <div class="p-3">
                      <button v-if="isAuthenticated" class="bg-gradient-to-r from-transparent-500 to-orange-500 w-full sm:w-32 py-2">Edit</button>
                    </div>
                </div>
                <div>
                    <input 
                        type="checkbox" 
                        :id="drink.drink_id" 
                        :checked="isSelected"
                        @change="updateSelectedDrinks"
                    >
                    <label :for="drink.drink_id" class="ml-2">Yes Please! 😋</label>
                </div>
            </div>
        </div>
        <div class="image-content flex-1 flex justify-center items-center"> <!-- Flex container with centering -->
            <img class="object-cover w-3/4 h-3/4 rounded" :src="drink.drink_image" alt="Drink Image">
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '../../store/auth';
export default {
  name: 'DrinkSlide',
  props: {
    drink: Object,
    selectedDrinks: Array
  },
  computed: {
    isSelected() {
        return this.selectedDrinks.includes(this.drink.drink_id);
    }
  },
  methods: {
    updateSelectedDrinks(event) {
      if (event.target.checked) {
        this.$emit('addDrink', this.drink.drink_id);
      } else {
        this.$emit('removeDrink', this.drink.drink_id);
      }
    }
  },
  setup() {
    const auth = useAuthStore();
    const isAuthenticated = computed(() => auth.isAuthenticated);

    return {
      isAuthenticated
    }
  }
};
</script>