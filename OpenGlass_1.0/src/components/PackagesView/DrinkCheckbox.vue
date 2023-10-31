<template>
  <div>
    <input 
      type="checkbox" 
      :id="drink.value" 
      :checked="isSelected" 
      @input="updateSelectedDrinks"
    >
    <label :for="drink.value" class="ml-2">{{ drink.name }}</label>
  </div>
</template>

<script>
export default {
  props: {
    drink: Object,
    selectedDrinks: Array,
  },
  computed: {
    isSelected() {
      return this.selectedDrinks.includes(this.drink.value);
    }
  },
  methods: {
    updateSelectedDrinks(event) {
      if (event.target.checked) {
        this.$emit('addDrink', this.drink.value);
      } else {
        this.$emit('removeDrink', this.drink.value);
      }
    }
  }
};
</script>
