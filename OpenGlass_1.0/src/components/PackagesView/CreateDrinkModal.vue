<template>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="open = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <!-- Modal Content -->
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Create a New Drink</DialogTitle>
                      <div class="mt-2">
                        <input type="text" v-model="drink.name" placeholder="Drink Name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                
                        <label>Select a Drink Type
                        <select v-model="drink.type" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option disabled value="">Choose...</option>
                            <option>Whiskey Cocktail</option>
                            <option>Tequila Cocktail</option>
                            <option>Vodka Cocktail</option>
                            <option>Gin Cocktail</option>
                            <option>Rum Cocktail</option>
                        </select>
                        </label>
                        
                        <textarea v-model="drink.description" placeholder="Description" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                        
                        <label for="drinkImage" class="block text-sm font-medium text-gray-700">Upload an Image:</label>
                        <input type="file" id="drinkImage" @change="handleImageUpload" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        
                        <div v-if="imagePreview" class="mt-4">
                        <label class="block text-sm font-medium text-gray-700">Preview:</label>
                        <img :src="imagePreview" class="mt-1 max-w-xs h-auto rounded-md">
                        </div>

                        <!-- Additional Fields for Alcohol and Ingredients -->
                        <input type="text" v-model="drink.alcohol" placeholder="Alcohol Content" class="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <textarea v-model="drink.ingredients" placeholder="Ingredients (comma-separated)" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button type="button" class="inline-flex w-full justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 sm:ml-3 sm:w-auto" @click="handleDrinkSubmit">Submit</button>
                  <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="open = false">Cancel</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useDrinkStore } from '../../store/drinks';
  
    const open = ref(true)
    const drink = ref({ name: '', description: '', type: '', image: null, alcohol: '', ingredients: [] })
    const imagePreview = ref(null)

    const store = useDrinkStore()

    // function handleSubmit() {
    // console.log('Submitting:', drink.value);
    // // You might need to handle the image file separately or convert it to a suitable format
    // open.value = false; // Close modal after submission
    // }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            drink.value.image = file;
            imagePreview.value = URL.createObjectURL(file);
        }
    }
    async function handleDrinkSubmit() {
        const result = await store.addDrink(drink.value);
        if (result) {
            // Handle success (e.g., show a success message, close the modal)
            console.log('Drink added successfully');
            open.value = false;
        } else {
            // Handle error (e.g., show an error message)
            console.log('Failed to add drink');
        }
    }
</script>
  