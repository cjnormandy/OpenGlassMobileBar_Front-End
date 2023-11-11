<template>
  <div v-for="(drinks, type) in groupedDrinks" :key="type" class="p-8">
    <h1 class="p-3 text-xl font-bold">{{ type }}</h1>
    <swiper
      :spaceBetween="30"
      :navigation="true"
      :pagination="{ clickable: true }"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide v-for="drink in drinks" :key="drink.drink_id">
        <drink-slide
          :drink="drink"
          :selected-drinks="selectedDrinks"
          @addDrink="handleAddDrink"
          @removeDrink="handleRemoveDrink"
        ></drink-slide>
      </swiper-slide>
    </swiper>
  </div>
</template>
  
  <style scoped>
  .slide-content {
      flex-direction: row;
  }
  </style>

  <script>
    import DrinkSlide from './DrinkSlide.vue';

    // Import Swiper Vue.js components
    import { Swiper, SwiperSlide } from 'swiper/vue';
  
    // Import Swiper styles
    import 'swiper/css';
    import 'swiper/css/effect-fade';
    import 'swiper/css/navigation';
    import 'swiper/css/pagination';
  
    // import required modules
    import { EffectFade, Navigation, Pagination } from 'swiper/modules';
  
    export default {
      props: {
        drinks: Array,
        selectedDrinks: Array,
      },
      computed: {
        isSelected() {
            return (drink) => this.selectedDrinks.includes(drink.drink_id);
        },
        groupedDrinks() {
          const groups = {};
          for (const drink of this.drinks) {
            if (!groups[drink.drink_type]) {
              groups[drink.drink_type] = [];
            }
            groups[drink.drink_type].push(drink);
          }
          return groups;
        }
      },
      methods: {
        handleAddDrink(drinkId) {
          this.$emit('addDrink', drinkId);
        },
        handleRemoveDrink(drinkId) {
          this.$emit('removeDrink', drinkId);
        }
      },
      components: {
        Swiper,
        SwiperSlide,
        DrinkSlide
      },
      setup() {
        return {
          modules: [EffectFade, Navigation, Pagination],
        };
      },
    };
  </script>
  