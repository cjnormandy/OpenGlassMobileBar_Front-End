<template>
  <div class="absolute inset-x-0 top-40 z-1">
    <!-- Jumbotron -->
    <div class="relative overflow-hidden bg-cover bg-no-repeat bg-center p-12 text-center" style="background-image: url('/gal_img2.png'); padding-bottom: 20%;"> 
        <!-- This padding value of 56.25% gives a 16:9 aspect ratio. Adjust as needed. -->
        <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style="background-color: rgba(0, 0, 0, 0.6)">
            <div class="flex h-full items-center justify-center">
                <div class="text-white">
                  <h2 class="mb-4 text-4xl font-semibold">About Us</h2>
                </div>
            </div>
        </div>
    </div>
    <!-- Jumbotron -->
    <div class="form p-12">
        <!-- Start of Card -->
        <div>
          <form>
            <div class="top-12">
              <!--if you want a thin border:<div class="border-b border-gray-900/10 pb-12"> -->
              <div class="About">
                <h2>This is an About page</h2>
              </div>
            </div>
          </form>
        </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>