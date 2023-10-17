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
                <div v-if="selectedService && !selectedDrink" class="mt-6">
                    <label for="specialDrinks" class="block mt-4 text-sm font-medium text-gray-700">Select a special drink:</label>
                    <select id="specialDrinks" v-model="selectedDrink" class="mt-1 p-2 rounded-md shadow-sm">
                        <option value="drink1">Special Drink 1</option>
                        <option value="drink2">Special Drink 2</option>
                        <option value="drink1">Special Drink 3</option>
                        <option value="drink2">Special Drink 4</option>
                        <option value="drink1">Special Drink 5</option>
                    </select>
                </div>
                <div v-if="selectedDrink && !selectedDate" class="mt-6">
                    <label for="date" class="block text-sm font-medium text-gray-700">Select a date:</label>
                    <input type="date" id="date" v-model="selectedDate" @change="selectDate(selectedDate)" class="mt-1 p-2 rounded-md shadow-sm">
                </div>
                <div v-if="selectedDate && !selectedTime" class="mt-6">
                    <label for="time" class="block text-sm font-medium text-gray-700">Select a time:</label>
                    <select id="time" v-model="selectedTime" @change="selectTime(selectedTime)" class="mt-1 p-2 rounded-md shadow-sm">
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <!-- Additional time slots can be added here -->
                    </select>
                </div>
                <div v-if="selectedTime" class="mt-6">
                    <div>
                      <button @click="pay">pay</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import { loadStripe } from '@stripe/stripe-js';
  import { StripeCheckout } from '@vue-stripe/vue-stripe';
  import { StripeElement, StripeElements } from 'vue-stripe-js';
  export default {
    components: {
        StripeCheckout,
        StripeElements,
        StripeElement,
    },
    data() {
      this.publishableKey = 'pk_test_51NzUcaDluQCGRUuAxAWcXePqwfKCxcuA2uOI0cTMR9gmb9S0oOg1t1ZQSZMRROWli2y7xAmQmrQ3m65Y2MMZmOQ700lEBYclIb';
      return {
        stripe: null,  // Stripe instance
        stripeLoaded: false,
        card: null,  // Card Element
        loading: false,
        lineItems: [
            {
                price: 'pi_3NzVTxDluQCGRUuA0XBjc3jd',
                quantity: 1,
            },
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
                image: '/simple_glass.png'
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
                image: '/premium_glass.png'
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
                image: '/signature_glass.png'
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
                image: '/open_glass.png'
            }
        ],

        selectedService: null,
        selectedDate: null,
        selectedTime: null,
        selectedDrink: null,
      };
    },
    methods: {
      submit () {
        this.$refs.checkoutRef.redirectToCheckout();
      },
      selectService(service) {
        this.selectedService = service;
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
      pay() {
        window.location.href = 'https://buy.stripe.com/test_9AQ6p99Il8rLfYY144';
      },
      createPaymentIntent() {
        fetch('https://mud-honey-coast.glitch.me/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"selectedService": "some-service"}),
        })
        .then(response => response.json())
        .then(data => {
          console.log('CJ got good payment:')
          this.resetSelection();
          if (data.clientSecret) {
            // Step 2: Handle the payment on the client
            console.log('Payment good:', data.clientSecret)
            this.handlePayment(data.clientSecret);
          } else {
            console.error('Payment failed:', data.message);
          }
        })
        .catch(error => {
          console.error('Fetch error:', error.message);
        });
      },
    },
    async loadStripe() {
      const stripeInstance = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
      this.stripe = stripeInstance;
      this.stripeLoaded = true;
    },
    pay() {
        this.processPayment(result.token);
        if (this.card) {
            this.stripe.createToken(this.card).then(result => {
            if (result.error) {
                // Handle error in your UI.
                console.error(result.error.message);
            } else {
                // Send the token to your server.
                this.processPayment(result.token);
            }
            });
        }
    },
    processPayment(token) {
        fetch('https://mud-honey-coast.glitch.me/create-payment-intent', {  // Update the URL to your server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"selectedService": "some-service"}),
        })
        .then(response => response.json())
        .then(data => {
        if (data.success) {
            // Handle successful payment
            console.log('Payment successful:', data);
        } else {
            // Handle failed payment
            console.error('Payment failed:', data.message);
        }
        })
        .catch(error => {
        // Handle fetch error
        console.error('Fetch error:', error.message);
        });
    },
    
    handlePayment(clientSecret) {
      const elements = this.stripe.elements();
      const cardElement = elements.create('card');

      cardElement.mount('#card-element');  // Assumes you have a div with id="card-element" where the card Element will be mounted

      this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // Include any additional collected billing details
          },
        },
      })
      .then(result => {
        if (result.error) {
          console.error(result.error.message);
        } else {
          // The payment succeeded!
          console.log('Payment succeeded:', result.paymentIntent.id);
        }
      });
    },
  };
  </script>
  
  <style scoped>
  /* If you have any styles specific to this component, place them here. */
  </style>
  