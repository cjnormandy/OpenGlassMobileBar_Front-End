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
  <div class="absolute inset-x-0 top-40 z-1" style="bottom: 0px">
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
    <!--Welcome Content-->
      <div class="text-center p-24">
        <h1 class="text-4xl font-bold text-gray-900 sm:text-6xl p-2">Open Glass Mobile Bar</h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">Welcome to Open Glass Mobile Bar – where we craft more than just cocktails; 
          We're on a mission to transform your event with an unforgettable mobile bartending experience! We believe that a great drink 
          is more than just a mix of ingredients; it's a journey of flavors, an artful creation, and a memory in the making. 
          Our passion lies in crafting inspired Latino cocktails that infuse a modern twist on classic favorites. 
          Join us on a journey where every sip is a celebration of flavor, and every moment is a toast to a vibrant spirit.
          <br><br>
          With a team of skilled mixologists and a passion for perfection, we're here to turn your event into an extraordinary affair. 
          From elegant weddings to lively corporate gatherings, we bring the bar to you, ensuring your guests are treated to an unforgettable experience. 
          Welcome to a unique world of mobile bartending services that's ready to elevate your event to new horizons. Cheers to the Open Glass Mobile Bar experience! </p>
      </div>
      <!--Extra Content-->
      <div class="text-center p-18">
        <h3 class="text-4xl font-bold text-gray-900 sm:text-6xl"> Check out our Drink Menu and Packages!</h3>
      </div>

      <section class="mb-24 text-center">
        <div class="grid gap-x-6 md:grid-cols-2 lg:gap-x-12 p-24">

          <div class="mb-0 md:mb-0">
            <div class="mb-2 inline-block rounded-md bg-primary-100 text-primary">
              <img src="src/assets/calender_photo.png" alt="Calendar Photo" class="h-20 w-20"> <!-- Updated image source -->
            </div>
            <router-link to="/menu" class="mb-4 text-lg font-bold block hover:text-gray-500">Drink Menu</router-link>
            <p class="text-neutral-500 dark:text-neutral-300">
              We currently feature over 20 specialty drinks! You provide the alcohol, and we provide you and your guests delicious drinks that are to die for.
            </p>
          </div>

          <div class="mb-0 md:mb-0">
            <div class="mb-2 inline-block rounded-md bg-primary-100 text-primary">
              <img src="/pack_img1.png" alt="Package Image" class="h-20 w-20"> <!-- Updated image source -->
            </div>
            <router-link to="/packages" class="mb-4 text-lg font-bold block hover:text-gray-500">Service Packages</router-link>
            <p class="text-neutral-500 dark:text-neutral-300">
              We feature four different Service Packages for your event. Each are aimed at different crowd sizes. All with at least one bartenders, equipment, and great service.
            </p>
          </div>
        </div>
        <!-- Instagram button section -->
        <div class="p-8">
        <a href="https://www.instagram.com/openglassmobilebar" target="_blank" class="bg-black text-white py-2 px-4 rounded-full hover:bg-gray-500 hover:text-white transition">
          Follow us on Instagram
        </a>
        </div>
      </section>
  </div>
  <RouterView />
</template>

<style scoped>
h3 {
  font-size: 2rem;
}
</style>