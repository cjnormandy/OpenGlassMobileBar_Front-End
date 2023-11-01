<template>
  <div class="absolute inset-x-0 top-40 z-1">
    <!-- Jumbotron -->
    <div class="relative overflow-hidden bg-cover bg-no-repeat bg-center p-12 text-center" style="background-image: url('src/assets/calender_photo.png'); padding-bottom: 20%;"> 
        <!-- This padding value of 56.25% gives a 16:9 aspect ratio. Adjust as needed. -->
        <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style="background-color: rgba(0, 0, 0, 0.6)">
            <div class="flex h-full items-center justify-center">
                <div class="text-white">
                  <h2 class="mb-4 text-4xl font-semibold">Our Drink Menu</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-white py-24 sm:py-12">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="p-7">
          <img decoding="async" width="1536" height="2048" alt="" data-srcset="https://travelingspiritbar.com/wp-content/uploads/2019/07/2.png 1536w, https://travelingspiritbar.com/wp-content/uploads/2019/07/2-225x300.png 225w, https://travelingspiritbar.com/wp-content/uploads/2019/07/2-768x1024.png 768w, https://travelingspiritbar.com/wp-content/uploads/2019/07/2-1152x1536.png 1152w" data-src="https://travelingspiritbar.com/wp-content/uploads/2019/07/2.png" data-sizes="(max-width: 1536px) 100vw, 1536px" class="kb-img wp-image-492 lazyloaded" src="https://travelingspiritbar.com/wp-content/uploads/2019/07/2.png" sizes="(max-width: 1536px) 100vw, 1536px" srcset="https://travelingspiritbar.com/wp-content/uploads/2019/07/2.png 1536w, https://travelingspiritbar.com/wp-content/uploads/2019/07/2-225x300.png 225w, https://travelingspiritbar.com/wp-content/uploads/2019/07/2-768x1024.png 768w, https://travelingspiritbar.com/wp-content/uploads/2019/07/2-1152x1536.png 1152w">
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
// Initialization for ES Users
import {
  Ripple,
  initTE,
} from "tw-elements";

initTE({ Ripple });
</script>