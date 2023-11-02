<script setup>
import { RouterView, useRouter } from 'vue-router'

// Get the router instance
const router = useRouter();

// Method to handle button click and navigate to home
const goToHome = () => {
  router.push('/home');
}
</script>

<template>
  <div class="absolute inset-x-0 top-40 z-1">
    <!-- Jumbotron -->
    <div class="relative overflow-hidden bg-cover bg-no-repeat bg-center p-12 text-center" style="background-image: url('/gal_img1.png'); padding-bottom: 20%;"> 
        <!-- This padding value of 56.25% gives a 16:9 aspect ratio. Adjust as needed. -->
        <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style="background-color: rgba(0, 0, 0, 0.6)">
            <div class="flex h-full items-center justify-center">
                <div class="text-white">
                  <h2 class="mb-4 text-4xl font-semibold">Welcome</h2>
                </div>
            </div>
        </div>
    </div>
        <div class="p-2 hidden sm:mb-8 sm:flex sm:justify-center">
            <div class="hidden sm:mb-8 sm:flex sm:justify-center">
              <div class="flex lg:flex-1">
              </div>
            <div class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our next round of funding. 
                <button @click="goToHome" class="font-semibold text-black">
                    Read more <span aria-hidden="true">&rarr;</span>
                </button>
            </div>
        </div>
        </div>
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-6xl p-2">Open Glass Mobile Bar</h1>
          
          <p class="mt-6 text-lg leading-8 text-gray-600">Hello! We are The Open Glass Mobile Bar. A professional, fully insured bartending company in Houston, TX that offers you and your guests a one-of-a-kind bartending experience. We serve weddings, special & corporate events with our 1959 vintage camper and other unique bar rental options.   We specialize in signature craft cocktails using seasonal and fresh ingredients and are committed to providing you and your guests a custom & memorable experience that will be talked about for days and toasted to for years to come!</p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a href="#" class="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Get started</a>
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    <RouterView />
</template>