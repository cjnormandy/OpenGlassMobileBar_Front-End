<template>
    <swiper
      :spaceBetween="30"
      :navigation="true"
      :pagination="{
        clickable: true,
      }"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide
        v-for="drink in drinks"
      >
        <div class="slide-content flex">
            <div class="text-content flex-1">
                <div class="text">
                    <div class="title">{{ drink.drink_name}}</div>
                    <div class="subtitle">drink.drink_type</div>
                    <div class="p-20">
                        <p>{{drink.drink_description}}</p>
                    </div>
                    <div>
                        <input 
                            type="checkbox" 
                            :id="drink.drink_id" 
                            :checked="isSelected(drink)" 
                            @input="event => updateSelectedDrinks(event, drink)"
                            >
                        <label :for="drink.drink_id" class="ml-2">Yes Please! 😋</label>
                    </div>
                </div>
            </div>
            <div class="image-content flex-1">
                <img class="object-cover w-full h-full rounded-l" :src="drink.drink_image" alt="Service Image">
            </div>
        </div>
      </swiper-slide>
    </swiper>
  </template>
  
  <style scoped>
  .slide-content {
      flex-direction: row;  /* This makes the text-content and image-content sit side by side */
  }
  </style>

  <script>
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
        drinks: Array,  // changed from Object to Array
        selectedDrinks: Array,
      },
      computed: {
        isSelected() {
            return (drink) => this.selectedDrinks.includes(drink.drink_id);
        }
      },
      methods: {
        updateSelectedDrinks(event, drink) {
          if (event.target.checked) {
            this.$emit('addDrink', drink.drink_id);
          } else {
            this.$emit('removeDrink', drink.drink_id);
          }
        }
      },
      components: {
        Swiper,
        SwiperSlide,
      },
      setup() {
        return {
          modules: [EffectFade, Navigation, Pagination],
        };
      },
    };
  </script>
  