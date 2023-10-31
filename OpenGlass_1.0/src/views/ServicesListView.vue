<template>
  <div class="absolute inset-x-0 top-40 z-1">
    <!-- Jumbotron -->
    <div class="relative overflow-hidden bg-cover bg-no-repeat bg-center p-12 text-center" style="background-image: url('/pack_img1.png'); padding-bottom: 20%;"> 
        <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style="background-color: rgba(0, 0, 0, 0.6)">
            <div class="flex h-full items-center justify-center">
                <div class="text-white">
                  <h2 class="mb-4 text-4xl font-semibold">Packages</h2>
                </div>
            </div>
        </div>
    </div>
    <!-- Jumbotron -->
    <div v-if="!selectedService">
      <div class="font-semibold text-3xl py-4 text-gray-500 hover:text-gray-600">
        Select a Package
      </div>
      <p class="text-base text-gray-900">"Every event is unique, which is why we provide flexible pricing options!"</p>
    </div>
    <div class="py-2">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="">
          <swiper @swiper="onSwiper" :options="swiperOptions" ref="mySwiper" v-if="!selectedService" class="carousel-card">
            <swiper-slide v-for="service in services" :key="service.title">
              <service-card :service="service" @selectService="selectService"></service-card>
            </swiper-slide>
          </swiper>
          <div v-if="!selectedService" class="button-container flex justify-between p-2">
            <button v-for="pkg in packages" :key="pkg" @click="selectPackage(pkg)" class="btn">{{ pkg }}</button>
          </div>
          <div>{{ selectedDrink }}</div>
          <div v-if="selectedService && selectedDrinks.length < selectedService.drinkLimit" class="mt-6">
            <label class="block mt-4 text-sm font-medium text-gray-700">Select a special drink:</label>
            <!-- Drink Checkboxes -->
            <drink-checkbox
              v-for="(drink, index) in drinks"
              :key="index"
              :drink="drink"
              :selectedDrinks="selectedDrinks"
              @addDrink="addDrink"
              @removeDrink="removeDrink"
            ></drink-checkbox>
          </div>

          <div v-if="selectedService && selectedDrinks.length === selectedService.drinkLimit && !selectedTime" class="mt-6">
            <!-- DateTimePicker -->
            <date-time-picker
              :selectedDate="selectedDate"
              :selectedTime="selectedTime"
              @update:selectedDate="selectedDate = $event"
              @update:selectedTime="selectedTime = $event"
            ></date-time-picker>
          </div>
          <div v-if="selectedTime" class="mt-6">
            <!-- PDF View Button -->
            <button @click="viewPDF" class="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View PDF
            </button>
            <label class="block text-sm font-medium text-gray-700">Enter your name for signature:</label>
            <!-- Signature Input -->
            <signature-input :signatureName="signatureName"></signature-input>
            <div>
              <button @click="pay">Pay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import ServiceCard from '../components/PackagesView/ServiceCard.vue';
  import DrinkCheckbox from '../components/PackagesView/DrinkCheckbox.vue';
  import DateTimePicker from '../components/PackagesView/DateTimePicker.vue';
  import SignatureInput from '../components/PackagesView/SignatureInput.vue';
  
  import { Swiper, SwiperSlide, useSwiper } from 'swiper/vue';
  import 'swiper/css';

  export default {
    components: {
      ServiceCard,
      DrinkCheckbox,
      DateTimePicker,
      SignatureInput,
      Swiper,
      SwiperSlide,
      ServiceCard,
    },
    setup() {
      const swiperRef = ref(null);

      const onSwiper = (swiper) => {
        swiperRef.value = swiper
      };
      const packages = ref(['Package 1', 'Package 2', 'Package 3', 'Package 4']);

      const selectPackage = (pkg) => {
        const index = packages.value.indexOf(pkg);
        swiperRef.value.slideTo(index);
      };

      return {
        packages,
        onSwiper,
        selectPackage,
      };
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        // packages: ['Package 1', 'Package 2', 'Package 3', 'Package 4'],
        selectedDrinks: [],
        drinks: [
            {name: 'Special Drink 1', value: 'drink1'},
            {name: 'Special Drink 2', value: 'drink2'},
            {name: 'Special Drink 3', value: 'drink3'},
            {name: 'Special Drink 4', value: 'drink4'},
            {name: 'Special Drink 5', value: 'drink5'},
        ],
        services: [
            {
                title: 'SIMPLE GLASS',
                description: [
                    'Description: Perfect for those on a budget, the Simple Glass tier offers essential bar services with a selection of 2 specialty drinks.',
                    'Suitable for events with up to 50 guests',
                    'Included Services:',
                    '- 1 Professional bartender',
                    '- 3-hour service',
                    '- 2 specialty drinks',
                    '- Bar menu displayed',
                    '- Mixers',
                    '- Garnishes',
                    '- Ice & cooling',
                    '- Napkins, straws, & cups',
                    '- Setup and cleanup',
                    '*PACKAGE DOES NOT INCLUDE ALCOHOL'
                ],
                image: '/simple_glass.png',
                drinkLimit: 2
            },
            {
                title: 'PREMIUM GLASS',
                description: [
                  'Description: Elevate your event',
                  'with our Premium Glass tier,',
                  'featuring a broader selection of 3',
                  'specialty drinks and upgraded',
                  'service. Ideal for events with up to',
                  '100 guests',
                  'Included Services:',
                  '- 2 Professional bartenders',
                  '- 3-hour service',
                  '- 3 specialty drinks',
                  '- Bar equipment',
                  '- Bar menu displayed',
                  '- Bar condiments',
                  '- Mixers',
                  '- Garnishes',
                  '- Ice & cooling',
                  '- Napkins, straws, & cups',
                  '- Setup and cleanup',
                  '*PACKAGE DOES NOT INCLUDE ALCOHOL'
                ],
                image: '/premium_glass.png',
                drinkLimit: 3
            },
            {
                title: 'SIGNATURE GLASS',
                description: [
                  'Description: The ultimate',
                  'experience for those who want to',
                  'impress their guests with a wide',
                  'range of premium drinks and top-',
                  'notch service. Suitable for larger',
                  'events with up to 150 guests',
                  'Included Services:',
                  '- 2 Professional bartenders',
                  '- 3-hour service',
                  '- 5 specialty drinks',
                  '- Unique serving presentations',
                  '- Bar equipment',
                  '- Custom cocktail menu tailored to your event',
                  '- Bar condiments',
                  '- Mixers',
                  '- Garnishes',
                  '- Ice & cooling',
                  '- Napkins, straws, & cups',
                  '- Setup and cleanup',
                  '*PACKAGE DOES NOT INCLUDE ALCOHOL'
                ],
                image: '/signature_glass.png',
                drinkLimit: 5
            },
            {
                title: 'THE "OPEN GLASS"',
                description: [
                  'Description: For the most exclusive',
                  'and personalized bar experience,',
                  'choose our Glass tier. We\'ll work',
                  'closely with you to create a one-',
                  'of-a-kind bar experience that',
                  'matches your event\'s theme and',
                  'requirements. Pricing varies based',
                  'on customization. Tailored to the',
                  'specific needs of your event,',
                  'accommodating even the largest',
                  'gatherings.',
                  '- Customizable service',
                  '*We will provide a consultation to',
                  'discuss your requirements and',
                  'provide you with a customized',
                  'quote.'
                ],
                image: '/open_glass.png',
                drinkLimit: 5
            }
        ],

        selectedService: null,
        selectedDate: null,
        selectedTime: null,
        selectedDrink: null,
        signatureName: '',
        isEditing: false,
      };
    },
    watch: {
        isEditing: function(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.$refs.signatureInput.focus();
                });
            }
        },
    },
    methods: {
      submit () {
        this.$refs.checkoutRef.redirectToCheckout();
      },
      selectDate(date) {
        this.selectedDate = date;
      },
      selectTime(time) {
        this.selectedTime = time;
      },
      selectService(service) {
        this.selectedService = service;
        this.selectedDrinks = []; // Clear previously selected drinks
      },
      payForService() {
        // Payment logic here
        this.resetSelection();
      },
      resetSelection() {
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
      },
      selectService(service) {
          this.selectedService = service;
          this.selectedDrinks = [];
      },
      addDrink(drinkValue) {
        if (!this.selectedDrinks.includes(drinkValue)) {
          this.selectedDrinks.push(drinkValue);
        }
      },
      removeDrink(drinkValue) {
        const index = this.selectedDrinks.indexOf(drinkValue);
        if (index !== -1) {
          this.selectedDrinks.splice(index, 1);
        }
      },
      viewPDF() {
          window.open('/service_agreement.pdf', '_blank');
      },
      pay() {
          let paymentUrl = '';

          switch (this.selectedService.title) {
              case 'PREMIUM GLASS':
                  paymentUrl = 'https://buy.stripe.com/test_5kA4h18EhbDXbIIcMO';
                  break;
              case 'SIGNATURE GLASS':
                  paymentUrl = 'https://buy.stripe.com/test_cN28xh9IleQ9dQQ5kn';
                  break;
              case 'THE "OPEN GLASS"':
                  paymentUrl = 'https://buy.stripe.com/test_eVaeVFf2FgYh288bIM';
                  break;
              default:
                  paymentUrl = 'https://buy.stripe.com/test_9AQ00L7Ad5fz6oo6op';
                  break;
          }

          window.location.href = paymentUrl;
      }
    },
  };
  </script>
  
  
<style>
.carousel-container {
  width: 75%;
  margin: auto;
}
</style>