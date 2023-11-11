<template>
  <div class="flex flex-col md:flex-row gap-4">
      <!-- Date Picker -->
      <div class="w-full md:w-1/2" v-if="dateValue">
          <label for="date" class="block text-sm font-medium text-gray-700">Select a date:</label>
            <vue-tailwind-datepicker 
                v-model="dateValue" 
                no-input 
                as-single 
                :formatter="formatter"
                :disable-date="dDate"
                @input="onDateSelected"
                class="p-2 rounded-md shadow-sm bg-white"
            />
          <!-- <input type="date" id="date" :value="selectedDate" @change="selectDate($event)" class="mt-1 p-2 rounded-md shadow-sm w-full"> -->
      </div>

      <!-- Time Picker -->
      <div class="w-full md:w-1/2" v-if="!dateSelected">
          <label for="time" class="block text-sm font-medium text-gray-700">Select a time:</label>
          <ul class="mt-1 p-2 rounded-md shadow-sm w-full bg-white">
              <li v-for="(time, index) in times" :key="index" @click="selectTime(time)" :class="selectedTime === time ? 'bg-gray-200' : ''" class="p-2 cursor-pointer">
                  {{ time }}
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import VueTailwindDatepicker from 'vue-tailwind-datepicker';

export default {
  components: {
    VueTailwindDatepicker
  },
  setup(props, { emit }) {
    const dateValue = ref([]);
    const formatter = ref({
      date: 'DD MMM YYYY',
      month: 'MMM',
    });

    const disabledDates = computed(() => {
      let dates = [];
      let currentDate = new Date();
      const endDate = new Date(2023, 11, 8);
      
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3) {
          dates.push(currentDate.toISOString().split('T')[0]);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return dates;
    });

    function dDate(date) {
        const dayOfWeek = date.getDay();
        return dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3;
    }

    watch(dateValue, (newDate) => {
      if (newDate) {
        emit('update:selectedDate', newDate);
      }
    });

    return {
      dateValue,
      formatter,
      dDate,
      disabledDates
    };
  },
  data() {
    return {
        selectedDate: '',
        selectedTime: '',
        dateSelected: false,
        times: ['10:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '6:00 PM - 10:00 PM']
    };
  },
  methods: {
    selectDate(event) {
        this.selectedDate = event.target.value;
        this.$emit('update:selectedDate', this.selectedDate);
    },
    selectTime(time) {
        this.selectedTime = time;
        this.$emit('update:selectedTime', this.selectedTime);
    },
    onDateSelected() {
      this.dateSelected = true;
    }
  }
};
</script>

<style scoped>
.w-full.md\:w-1\/2 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
