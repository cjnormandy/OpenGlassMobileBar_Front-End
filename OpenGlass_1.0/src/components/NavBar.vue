<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '../store/auth';

const navigation = [
  { name: 'Drink Menu', href: '/menu' },
  { name: 'Packages', href: '/packages' },
  { name: 'About Us', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]

const auth = useAuthStore();
const isAuthenticated = computed(() => auth.isAuthenticated);
const mobileMenuOpen = ref(false)

function handleLogout() {
  auth.logout();
}
</script>

<template>
  <header class="absolute inset-x-0 top-0 z-50">
    <nav class="flex items-center justify-between p-0 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Open Glass</span>
          <img alt="Open Glass logo" class="logo" src="../assets/openg_logo_v2.png" width="150" height="150" />
        </a>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <a v-for="item in navigation" :key="item.name" :href="item.href"
          class="text-lg font-semibold leading-6 text-gray-900">{{ item.name }}</a>
        <a href="/events" v-if="isAuthenticated" class="text-lg font-semibold leading-6 text-gray-900">Events</a>
        <a href="/orders" v-if="isAuthenticated" class="text-lg font-semibold leading-6 text-gray-900">Orders</a>
        <a href="/inventory" v-if="isAuthenticated" class="text-lg font-semibold leading-6 text-gray-900">Inventory</a>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a v-if="!isAuthenticated" href="/login" class="text-lg font-semibold leading-6 text-gray-900">Log in <span
            aria-hidden="true">&rarr;</span></a>
        <button v-else @click="handleLogout" class="text-lg font-semibold leading-6 text-gray-900 cursor-pointer">Log out</button>
      </div>
    </nav>
    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-50" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Your Company</span>
            <img alt="Open Glass logo" class="logo" src="../assets/openg_logo_v2.png" width="150" height="150" />
          </a>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <a v-for="item in navigation" :key="item.name" :href="item.href"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{{
                  item.name }}</a>
              <a href="/events" v-if="isAuthenticated"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Events</a>
              <a href="/orders" v-if="isAuthenticated"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Orders</a>
            </div>
            <div class="py-6">
              <a href="/login" v-if="!isAuthenticated"
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log in</a>
              <button v-else @click="handleLogout"
                      class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer">Log out</button>
            </div>
        </div>
      </div>
    </DialogPanel>
  </Dialog>
</header></template>