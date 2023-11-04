<template>
  <div class="flex flex-col md:flex-row gap-4">
      <!-- Date Picker -->
      <div class="w-full md:w-1/2">
          <label for="date" class="block text-sm font-medium text-gray-700">Select a date:</label>
            <vue-tailwind-datepicker 
                v-model="dateValue" 
                no-input 
                as-single 
                :formatter="formatter"
                :disabled-dates="dDate"
            />
          <!-- <input type="date" id="date" :value="selectedDate" @change="selectDate($event)" class="mt-1 p-2 rounded-md shadow-sm w-full"> -->
      </div>

      <!-- Time Picker -->
      <div class="w-full md:w-1/2">
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
import { ref } from 'vue'

const dateValue = ref(Date)
const formatter = ref({
  date: 'DD MMM YYYY',
  month: 'MMM',
})
function dDate(date) {
    // const dayOfWeek = date.getDay();
    return date < new Date() || date > new Date(2023, 11, 8)
}

export default {
  data() {
      return {
          selectedDate: '',
          selectedTime: '',
          times: ['10:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '6:00 PM - 10:00 PM']
      };
  },
  methods: {
      selectDate(event) {
          this.selectedDate = event.target.value;
          // You can emit the selected date to the parent component if needed
          this.$emit('update:selectedDate', this.selectedDate);
      },
      selectTime(time) {
          this.selectedTime = time;
          // You can emit the selected time to the parent component if needed
          this.$emit('update:selectedTime', this.selectedTime);
      },
  }
};
</script>