<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'

// Get the router instance
const router = useRouter();

// Method to handle button click and navigate to home
const goToHome = () => {
  router.push('/home');
}
</script>

<template>
    <div class="relative isolate px-6 pt-14 lg:px-8">
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#DA2000] to-[#F3C67A] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
      </div>
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-46">
        <div class="hidden sm:mb-8 sm:flex sm:justify-center">
            <div class="hidden sm:mb-8 sm:flex sm:justify-center">
            <div class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our next round of funding. 
                <button @click="goToHome" class="font-semibold text-orange-600">
                    Read more <span aria-hidden="true">&rarr;</span>
                </button>
            </div>
        </div>
        </div>
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-6xl ">Welcome to Open Glass!</h1>
          <h1 class="text-4xl font-bold text-gray-900 sm:text-6xl p-4">🍹</h1>
          
          <p class="mt-6 text-lg leading-8 text-gray-600">Hello! We are The Open Glass Mobile Bar. A professional, fully insured bartending company in Houston, TX that offers you and your guests a one-of-a-kind bartending experience. We serve weddings, special & corporate events with our 1959 vintage camper and other unique bar rental options.   We specialize in signature craft cocktails using seasonal and fresh ingredients and are committed to providing you and your guests a custom & memorable experience that will be talked about for days and toasted to for years to come!</p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a href="#" class="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Get started</a>
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#DA2000] to-[#F3C67A] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
      </div>
    </div>
    <RouterView />
</template>