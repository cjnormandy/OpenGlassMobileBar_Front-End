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
                        <p class="text-sm">{{ service.description }}</p>
                      </div>
                      <div class="px-6 pt-4 pb-2">
                        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
                        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
                        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="selectedService && !selectedDrink" class="mt-6">
                    <label for="specialDrinks" class="block mt-4 text-sm font-medium text-gray-700">Select a special drink:</label>
                    <select id="specialDrinks" v-model="selectedDrink" class="mt-1 p-2 rounded-md shadow-sm">
                        <option value="drink1">Special Drink 1</option>
                        <option value="drink2">Special Drink 2</option>
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
                        <StripeElements
                            v-if="stripeLoaded"
                            v-slot="{ elements, instance }"
                            :stripe-key="pk_test_51NzUcaDluQCGRUuAxAWcXePqwfKCxcuA2uOI0cTMR9gmb9S0oOg1t1ZQSZMRROWli2y7xAmQmrQ3m65Y2MMZmOQ700lEBYclIb"
                        >
                            <StripeElement
                            v-on:ready="card = $event"
                            :elements="elements"
                            />
                        </StripeElements>
                        <button type="button" @click="createPaymentIntent()">Pay</button>
                    </div>
                    <button @click="payForService()" class="bg-blue-500 text-white p-2 rounded-md shadow-sm hover:bg-blue-600">Pay for Service</button>
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
                description: 'Beer & wine service\nDescription: Perffect for those on a\nbudget, the Simple Glass tier offers\nessential bar services with a selection\nof 2 specialty drinks. Suitable for\nevents with up to 50 guests\n\nIncluded Services:\n- 1 Professional bartender\n- 3-hour service\n- 2 specialty drinks\n- Bar menu displayed\n- Mixers\n- Garnishes\n- Ice & cooling\n- Napkins, straws, & cups\n- Setup and cleanup\n*PACKAGE DOES NOT INCLUDE ALCOHOL',
                image: '/simple_glass.png'
            },
            {
                title: 'PREMIUM GLASS',
                description: 'Beer & wine service\nDescription: Elevate your event\nwith our Premium Glass tier,\nfeaturing a broader selection of 3\nspecialty drinks and upgraded\nservice. Ideal for events with up to\n100 guests\n\nIncluded Services:\n- 2 Professional bartenders\n- 3-hour service\n- 3 specialty drinks\n- Bar equipment\n- Bar menu displayed\n- Bar condiments\n- Mixers\n- Garnishes\n- Ice & cooling\n- Napkins, straws, & cups\n- Setup and cleanup\n*PACKAGE DOES NOT INCLUDE ALCOHOL',
                image: '/premium_glass.png'
            },
            {
                title: 'SIGNATURE GLASS',
                description: 'Beer & wine service\nDescription: The ultimate\nexperience for those who want to\nimpress their guests with a wide\nrange of premium drinks and top-\nnotch service. Suitable for larger\nevents with up to 150 guests\n\nIncluded Services:\n- 2 Professional bartenders\n- 3-hour service\n- 5 specialty drinks\n- Unique serving presentations\n- Bar equipment\n- Custom cocktail menu tailored to your event\n- Bar condiments\n- Mixers\n- Garnishes\n- Ice & cooling\n- Napkins, straws, & cups\n- Setup and cleanup\n*PACKAGE DOES NOT INCLUDE ALCOHOL',
                image: '/signature_glass.png'
            },
            {
                title: 'THE "OPEN GLASS"',
                description: 'Beer & wine service\nDescription: For the most exclusive\nand personalized bar experience,\nchoose our Glass tier. We\'ll work\nclosely with you to create a one-\nof-a-kind bar experience that\nmatches your event\'s theme and\nrequirements. Pricing varies based\non customization. Tailored to the\nspecific needs of your event,\naccommodating even the largest\ngatherings.\n\n- Customizable service\n*We will provide a consultation to\ndiscuss your requirements and\nprovide you with a customized\nquote.',
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
  