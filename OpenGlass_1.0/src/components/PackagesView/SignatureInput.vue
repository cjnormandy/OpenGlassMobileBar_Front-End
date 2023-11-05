<template>
    <div>
      <!-- Display Mode -->

      <div v-if="!isEditing" @click="isEditing = true" class="mt-1 p-2 rounded-md shadow-sm border bg-white cursor-text placeholder-gray-400">
        <vue-pdf-embed :source="'/service_agreement.pdf'" />
        <p v-if="signatureName" class="font-dancingScript text-xl">{{ signatureName }}</p>
        <p v-else class="text-gray-400">Click to sign</p>
      </div>
  
      <!-- Editing Mode -->
      <input v-if="isEditing" type="text" :value="signatureName" @blur="isEditing = false" class="mt-1 p-2 rounded-md shadow-sm bg-white" placeholder="Type your name here" ref="signatureInput" />
    </div>
  </template>
  
  <script>
  import VuePdfEmbed from 'vue-pdf-embed'
  export default {
    props: {
      signatureName: String,
    },
    components: {
      VuePdfEmbed,
    },
    data() {
      return {
        source1: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        isEditing: false,
      };
    },
  };
  </script>