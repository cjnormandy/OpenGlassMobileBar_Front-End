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
        <div class="p-3">
          <div v-if="!selectedService" class=" p-2 flex flex-wrap -mx-2">
            <div v-for="service in services" :key="service.title" class="px-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <service-card :service="service" @selectService="selectService"></service-card>
            </div>
          </div>
          <!-- Button to Open the Create Drink Modal -->
          <!-- <div class="flex justify-start p-4">
            <button 
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded" 
              @click="openModal">
              Create Drink
            </button>
          </div> -->

          <!-- Back Button -->
          <div v-if="selectedService" class="flex justify-start p-4">
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded" @click="goBack">
              Back
            </button>
          </div>

          <!-- Create Drink Modal Component -->
          <CreateDrinkModal v-if="openCreateDrinkModal" @close="openCreateDrinkModal = false" />
          <div v-if="selectedService && selectedDrinks.length < selectedService.drinkLimit" class="mt-6">
            <label class="mb-4 text-4xl font-semibold">Select a special drink:</label>
            <!-- Drink Cards -->
            <drink-card
              v-for="(drinks, type) in drinksByType"
              :key="type"
              :drinks="drinks"
              :selectedDrinks="selectedDrinks"
              @addDrink="addDrink"
              @removeDrink="removeDrink"
            ></drink-card>
          </div>

          <div v-if="selectedService && selectedDrinks.length === selectedService.drinkLimit && !selectedTime" class="mt-6">
            <!-- DateTimePicker -->
            <date-time-picker
              :selectedDate="selectedDate"
              :selectedTime="selectedTime"
              @update:selectedDate="handleDateChange"
              @update:selectedTime="selectedTime = $event"
            ></date-time-picker>
          </div>
          <div v-if="selectedTime" class="mt-6">
            <label class="block text-base font-semibold text-gray-700">Please enter your information:</label>
            <signature-input :signatureName="signatureName" :selectedDate="selectedDate" :service-amt="selectedService.price" :serv_id="selectedService.service_id"></signature-input>
            <div>
              <button :disabled="!isFormValid" class="bg-gradient-to-r from-yellow-500 to-orange-500 w-full sm:w-32 py-2" @click="pay">Pay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
  import { ref, onMounted, computed } from 'vue';
  import ServiceCard from '../components/PackagesView/ServiceCard.vue';
  import DrinkCard from '../components/PackagesView/DrinkCard.vue';
  import DateTimePicker from '../components/PackagesView/DateTimePicker.vue';
  import SignatureInput from '../components/PackagesView/SignatureInput.vue';
  import CreateDrinkModal from '../components/PackagesView/CreateDrinkModal.vue';
  
  import { Swiper, SwiperSlide} from 'swiper/vue';
  import 'swiper/css';

  import { useServiceStore } from '../store/services';
  import { useDrinkStore } from '../store/drinks';

  export default {
    components: {
      ServiceCard,
      DrinkCard,
      DateTimePicker,
      SignatureInput,
      Swiper,
      SwiperSlide,
      ServiceCard,
      CreateDrinkModal
    },
    setup() {
      const swiperRef = ref(null);
      const openCreateDrinkModal = ref(false)
      const drinksDB = useDrinkStore();
      const servicesDB = useServiceStore();
      const drinksByType = computed(() => {
      return drinksDB.drinks.reduce((acc, drink) => {
          const type = drink.drink_type;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(drink);
          return acc;
        }, {});
      });
      const services = computed(() => {
        return servicesDB.services.map(service => ({
              // Map the service properties to the format expected by your UI
              service_id: service.service_id,
              title: service.service_name.toUpperCase(),
              description: [
                `Description: ${service.service_description_1}`,
                service.service_description_2,
                service.service_description_3,
              ],
              included_services: service.included_services,
              // You might need to define how to get the image and drinkLimit from your service object
              image: `/${service.service_name.toLowerCase().replace(' ', '_')}.png`,
              price: service.service_price,
              drinkLimit: service.drinkLimit

            }));
      })
      
      const onSwiper = (swiper) => {
        swiperRef.value = swiper
      };
      const packages = ref(['Package 1', 'Package 2', 'Package 3', 'Package 4']);

      const selectPackage = (pkg) => {
        const index = packages.value.indexOf(pkg);
        swiperRef.value.slideTo(index);
      };

      const getAllServicesDB = async () => {
        const success = await servicesDB.getServices();
        if (success) {
          console.log(servicesDB.services)
        } else {
          // Show an error message
        }
      };

      const getAllDrinks = async () => {
        console.log('Calling handleSubmit')
        const success = await drinksDB.getDrinks();
        if (success) {
          console.log(drinksDB.drinks)
        } else {
          // Show an error message
        }
      };

      onMounted(getAllDrinks)
      onMounted(async () => {
        if (!servicesDB.services.length) {
          await getAllServicesDB();
        }
      });
      onMounted(getAllServicesDB)

      function openModal() {
        openCreateDrinkModal.value = true
      }

      return {
        packages,
        onSwiper,
        selectPackage,
        drinksByType,
        services,
        openCreateDrinkModal,
        openModal
      };
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 4,
          spaceBetween: 30,
          freeMode: true
        },
        selectedDrinks: [],
        drinks: [],
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
    computed: {
        isFormValid() {
            return (
                this.selectedDate.trim() !== ''
            );
        },
    },
    methods: {
      // openModal() {
      //   openCreateDrinkModal.value = true
      // },
      goBack() {
        this.selectedService = null
        this.selectedDate = null
        this.selectedTime = null
        this.selectedDrinks = []
      },
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
      handleDateChange(newDate) {
        this.selectedDate = newDate;
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
              case 'THE OPEN GLASS':
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