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
        v-for="(drink, index) in drinks"
      >
        <div class="slide-content flex">
            <div class="text-content flex-1">
                <div class="text">
                    <div class="title">{{ drink.name}}</div>
                    <div class="subtitle">Subtitle</div>
                    <div class="text">
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                        dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla
                        laoreet justo vitae porttitor porttitor. Suspendisse in sem justo.
                        Integer laoreet magna nec elit suscipit, ac laoreet nibh euismod.
                        Aliquam hendrerit lorem at elit facilisis rutrum. Ut at ullamcorper
                        velit. Nulla ligula nisi, imperdiet ut lacinia nec, tincidunt ut
                        libero. Aenean feugiat non eros quis feugiat.
                        </p>
                    </div>
                </div>
                <div class="p-4">
                    <input 
                        type="checkbox" 
                        :id="drink.value" 
                        :checked="isSelected(drink)" 
                        @input="event => updateSelectedDrinks(event, drink)"
                        >
                    <label :for="drink.value" class="ml-2">Yes Please! 😋</label>
                </div>
            </div>
            <div class="image-content flex-1">
                <img class="object-cover w-full h-full rounded-l" :src="drink.image" alt="Service Image">
            </div>
        </div>
      </swiper-slide>
    </swiper>
  </template>
  
  <style scoped>
  .slide-content {
      flex-direction: row;  /* This makes the text-content and image-content sit side by side */
  }
  .text-content {
      padding: 20px;  /* Optional: Adding some padding around text content */
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
            return (drink) => this.selectedDrinks.includes(drink.value);
        }
      },
      methods: {
        updateSelectedDrinks(event, drink) {
          if (event.target.checked) {
            this.$emit('addDrink', drink.value);
          } else {
            this.$emit('removeDrink', drink.value);
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
  