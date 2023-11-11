// Cite: https://router.vuejs.org/guide/
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist';
import './style.css'
import App from './App.vue'
import router from './router'

import VueTailwindDatepicker from "vue-tailwind-datepicker";

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
pinia.use(piniaPluginPersist);
app.use(router)
app.use(VueTailwindDatepicker)
app.mount('#app')