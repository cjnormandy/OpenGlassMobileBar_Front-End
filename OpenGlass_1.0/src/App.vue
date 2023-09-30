<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'

import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="bg-white">
    <NavBar/>

    <RouterView/>
  </div>
</template>