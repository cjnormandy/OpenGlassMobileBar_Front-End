<template>
    <div class="bg-white py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="p-8">
                <div v-if="!selectedService" class="grid grid-cols-1 gap-4">
                  <div v-for="service in services" @click="selectService(service)" class="bg-white p-4 rounded shadow-lg cursor-pointer hover:bg-gray-50">
                    <div class="max-w-sm rounded overflow-hidden shadow-lg">
                      <img class="w-full" :src="service.image" alt="test">
                      <div class="px-6 py-4">
                        <div class="font-bold text-xl mb-2">{{ service.title }}</div>
                        <ul class="text-gray-700 text-base text-left">
                            <li v-for="descItem in service.description" :key="descItem">{{ descItem }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div>{{ selectedDrink }}</div>
                <div v-if="selectedService && selectedDrinks.length < selectedService.drinkLimit" class="mt-6">
                  <label class="block mt-4 text-sm font-medium text-gray-700">Select a special drink:</label>
                  <div v-for="(drink, index) in drinks" :key="index">
                      <input type="checkbox" :id="drink.value" v-model="selectedDrinks" :value="drink.value">
                      <label :for="drink.value" class="ml-2">{{ drink.name }}</label>
                  </div>
                </div>
                <div v-if="selectedService && selectedDrinks.length === selectedService.drinkLimit && !selectedDate" class="mt-6">
                    <label for="date" class="block text-sm font-medium text-gray-700">Select a date:</label>
                    <input type="date" id="date" v-model="selectedDate" @change="selectDate(selectedDate)" class="mt-1 p-2 rounded-md shadow-sm">
                </div>
                <div v-if="selectedDate && !selectedTime" class="mt-6">
                    <label for="time" class="block text-sm font-medium text-gray-700">Select a time:</label>
                    <select id="time" v-model="selectedTime" @change="selectTime(selectedTime)" class="mt-1 p-2 rounded-md shadow-sm">
                        <option value="10:00 AM">10:00 AM - 1:00 PM</option>
                        <option value="11:00 AM">2:00 PM - 4:00 PM</option>
                        <option value="12:00 PM">6:00 PM - 10:00 PM</option>
                    </select>
                </div>
                <div v-if="selectedTime" class="mt-6">
                    <!-- PDF View Button -->
                    <button @click="viewPDF" class="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        View PDF
                    </button>

                    <label class="block text-sm font-medium text-gray-700">Enter your name for signature:</label>
                    
                    <!-- Display Mode -->
                    <div v-if="!isEditing" @click="isEditing = true" class="mt-1 p-2 rounded-md shadow-sm border bg-white cursor-text placeholder-gray-400">
                        <p v-if="signatureName" class="font-dancingScript text-xl">{{ signatureName }}</p>
                        <p v-else class="text-gray-400">Click to sign</p>
                    </div>
                    
                    <!-- Editing Mode -->
                    <input v-if="isEditing" type="text" v-model="signatureName" @blur="isEditing = false" class="mt-1 p-2 rounded-md shadow-sm bg-white" placeholder="Type your name here" ref="signatureInput" />
                    <div>
                      <button @click="pay">pay</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import { StripeCheckout } from '@vue-stripe/vue-stripe';
  import { StripeElement, StripeElements } from 'vue-stripe-js';
  export default {
    components: {
        StripeCheckout,
        StripeElements,
        StripeElement,
    },
    data() {
      return {
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
        }
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
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&display=swap');
</style>