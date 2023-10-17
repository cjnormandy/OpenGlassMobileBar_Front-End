<template>
  <div class="bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="p-8">
          <div class="p-4 grid grid-cols-2 gap-4">
            <div v-for="image in images" :key="image.id" class="rounded-lg overflow-hidden">
              <img :src="image.url" :alt="image.description" @click="openImage(image)" class="w-full h-auto transform transition-transform duration-300 hover:scale-105 cursor-pointer" />
            </div>

            <!-- Modal for larger view -->
            <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
              <span @click="showModal = false" class="absolute top-4 right-6 text-white text-2xl font-bold cursor-pointer hover:text-gray-500">&times;</span>
              <img :src="currentImage.url" :alt="currentImage.description" class="max-w-4/5 max-h-4/5 m-auto block" />
              <div class="text-center text-white mt-4">{{ currentImage.description }}</div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Gallery',
  data() {
    return {
      images: [
        { id: 1, url: '/gal_img1.png', description: 'Image 1 description' },
        { id: 2, url: '/gal_img2.png', description: 'Image 2 description' },
        { id: 3, url: '/gal_img3.png', description: 'Image 3 description' },
      ],
      showModal: false,
      currentImage: {},
    };
  },
  methods: {
    openImage(image) {
      this.currentImage = image;
      this.showModal = true;
    },
  },
};
</script>

