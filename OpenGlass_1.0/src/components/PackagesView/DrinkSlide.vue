<template>
    <div class="slide-content flex">
        <div class="text-content flex-1">
            <div class="text">
                <div class="title">{{ drink.drink_name }}</div>
                <div class="subtitle">{{ drink.drink_type }}</div>
                <div class="p-20">
                    <p>{{ drink.drink_description }}</p>
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
        <div class="image-content flex-1">
            <img class="object-cover w-full h-full rounded-l" :src="drink.drink_image" alt="Drink Image">
        </div>
    </div>
</template>

<script>
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
  }
};
</script>