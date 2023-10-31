<template>
    <div>
      <!-- Date input -->
      <label for="date" class="block text-sm font-medium text-gray-700">Select a date:</label>
      <input type="date" id="date" :value="selectedDate" @change="selectDate($event)" class="mt-1 p-2 rounded-md shadow-sm">
  
      <!-- Time input -->
      <label for="time" class="block text-sm font-medium text-gray-700">Select a time:</label>
      <select id="time" :value="selectedTime" @change="selectTime($event)" class="mt-1 p-2 rounded-md shadow-sm">
        <option value="10:00 AM">10:00 AM - 1:00 PM</option>
        <option value="11:00 AM">2:00 PM - 4:00 PM</option>
        <option value="12:00 PM">6:00 PM - 10:00 PM</option>
      </select>
    </div>
</template>

<script>
export default {
    props: {
      selectedDate: String,
      selectedTime: String,
    },
    methods: {
      selectDate(event) {
        this.$emit('update:selectedDate', event.target.value); // Emit the changed date
      },
      selectTime(event) {
        this.$emit('update:selectedTime', event.target.value); // Emit the changed time
      },
    },
};
</script>
