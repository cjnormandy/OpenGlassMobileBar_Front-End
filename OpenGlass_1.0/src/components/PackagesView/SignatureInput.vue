<template>
    <div>
      <customer-form :selectedDate="selectedDate" :amt="serviceAmt"/>
      <input v-if="isEditing" type="text" :value="signatureName" @blur="isEditing = false" class="mt-1 p-2 rounded-md shadow-sm bg-white" placeholder="Type your name here" ref="signatureInput" />
    </div>
  </template>
  
  <script>
  import VuePdfEmbed from 'vue-pdf-embed'
  import CustomerForm from './CustomerForm.vue';
  export default {
    props: {
      signatureName: String,
      selectedDate: String,
      serviceAmt: String
    },
    components: {
    VuePdfEmbed,
    CustomerForm
},
    data() {
      return {
        source1: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        isEditing: false,
      };
    },
  };
  </script>