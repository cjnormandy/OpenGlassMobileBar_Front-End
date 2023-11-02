<script setup>
import VueTailwindDatepicker from 'vue-tailwind-datepicker'
import { ref, computed } from 'vue'

const dateValue = ref([])

const eventName = ref('')
const eventDate = ref('')
const hours = ref(0)
const barLocations = ref(1)
const totalGuests = ref(0)
const drinkPercentage = ref(85)
const drinkType = ref('Average Drinkers')
const beerPreference = ref(30)
const winePreference = ref(20)
const cocktailPreference = ref(50)

const calculatedResults = computed(() => {
    let drinksPerGuestPerHour;
    switch (drinkType.value) {
        case 'Light Drinkers':
            drinksPerGuestPerHour = 0.5;
            break;
        case 'Average Drinkers':
            drinksPerGuestPerHour = 1;
            break;
        case 'Heavy Drinkers':
            drinksPerGuestPerHour = 1.5;
            break;
        case 'Very Heavy Drinkers':
            drinksPerGuestPerHour = 2;
            break;
        default:
            drinksPerGuestPerHour = 1; // default to Average Drinkers
    }

    const totalDrinks = totalGuests.value * (drinkPercentage.value / 100) * drinksPerGuestPerHour * hours.value;

    const beer = totalDrinks * (beerPreference.value / 100);
    const wine = totalDrinks * (winePreference.value / 100);
    const liquor = totalDrinks * (cocktailPreference.value / 100);

    const beerBottles = Math.ceil(beer); 
    const wineBottles = Math.ceil(wine / 5); // 5 servings per 750ml bottle
    const liquorBottles = Math.ceil(liquor / 16.67); // 16.67 servings per 750ml bottle

    const beerCost = beer * 1; // assuming $1 per beer as placeholder
    const wineCost = wine * 4; // assuming $4 per wine serving as placeholder
    const liquorCost = liquor * 3; // assuming $3 per liquor serving as placeholder

    const totalCost = beerCost + wineCost + liquorCost;

    return {
        beer: Math.round(beer),
        wine: Math.round(wine),
        liquor: Math.round(liquor),
        beerBottles: beerBottles,
        wineBottles: wineBottles,
        liquorBottles: liquorBottles,
        beerCases: Math.ceil(beerBottles / 24), // Assuming 24 bottles per case
        wineCases: Math.ceil(wineBottles / 12), // Assuming 12 bottles per case
        beerCost: beerCost,
        wineCost: wineCost,
        liquorCost: liquorCost,
        totalCost: totalCost
    }
})


</script>

<template>
    <div class="absolute inset-x-0 top-40 z-1">
        <!-- Jumbotron -->
        <div class="relative overflow-hidden rounded-lg bg-cover bg-no-repeat bg-center p-12 text-center" style="background-image: url('src/assets/calender_photo.png'); padding-bottom: 26.25%;"> 
            <!-- This padding value of 56.25% gives a 16:9 aspect ratio. Adjust as needed. -->
            <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style="background-color: rgba(0, 0, 0, 0.6)">
                <div class="flex h-full items-center justify-center">
                    <div class="text-white">
                        <h2 class="mb-4 text-4xl font-semibold">Event Calendar</h2>
                    </div>
                </div>
            </div>
        </div>
        <!-- Jumbotron -->
        <div class="flex items-center justify-center min-h-screen bg-white">
            <!-- Start of Card -->
            <div>
                <form>
                    <div class="top-12">
                        <div class="border-b border-gray-900/10 pb-12">
                        <h2 class="text-base font-semibold leading-7 text-gray-900">Event Details</h2>
                        <p class="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
                
                        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="col-span-full">
                            <label for="street-address" class="block text-sm font-medium leading-6 text-gray-900">Event/Host/Client Name*</label>
                            <div class="mt-2">
                                <input type="text" name="street-address" id="street-address" autocomplete="street-address" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                            </div>

                            <div class="sm:col-span-3">
                            <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">Date of Event</label>
                            <div class="border-b border-gray-900/10 pb-12">
                                <vue-tailwind-datepicker v-model="dateValue" placeholder="My Placeholder" />
                            </div>
                            </div>

                            <div class="sm:col-span-3">
                                <!-- Hours of Service Input -->
                                <label for="hours-of-service" class="block text-sm font-medium leading-6 text-gray-900">How Many Hours Will You Be Serving Drinks?</label>
                                <div class="mt-2">
                                    <input type="text" name="hours-of-service" id="hours-of-service" v-model="hours" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>

                            <div class="sm:col-span-3">
                                <!-- Bar Locations Input -->
                                <label for="bar-locations" class="block text-sm font-medium leading-6 text-gray-900">Number of Bar Locations/Setups</label>
                                <div class="mt-2">
                                    <select id="bar-locations" name="bar-locations" v-model="barLocations" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </select>
                                </div>
                            </div>

                            <div class="sm:col-span-3">
                                <!-- Total Guests Input -->
                                <label for="total-guests" class="block text-sm font-medium leading-6 text-gray-900">Total Number of Guests</label>
                                <div class="mt-2">
                                    <input type="text" name="total-guests" id="total-guests" v-model="totalGuests" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>

                            <div class="sm:col-span-4">
                                <!-- Drinking Percentage Slider -->
                                <label for="drink-percentage" class="block text-sm font-medium leading-6 text-gray-900">Percentage of Guests Who Drink</label>
                                <label for="drink-percentage" class="mb-2 inline-block text-neutral-700 dark:text-neutral-200">Industry-standard is 85%</label>
                                <input type="range" id="drink-percentage" v-model.number="drinkPercentage" class="transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600" />
                            </div>

                            <div class="sm:col-span-4">
                                <!-- Drinkers Type Radio Buttons -->
                                <label for="drinkers-type" class="block text-sm font-medium leading-6 text-gray-900">What Type of Drinkers Are Your Guests?*</label>
                                <div class="radio-group" id="drinkers-type">
                                    <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                        <!-- Light Drinkers -->
                                        <input type="radio" name="drinkers-type" id="light-drinkers" v-model="drinkType" value="Light Drinkers" />
                                        <label class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" for="light-drinkers">Light Drinkers (&lt 1 drink/hr)</label>
                                    </div>
                                    <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                        <!-- Average Drinkers -->
                                        <input type="radio" name="drinkers-type" id="average-drinkers" v-model="drinkType" value="Average Drinkers" checked />
                                        <label class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" for="average-drinkers">Average Drinkers (1 drink/hr)</label>
                                    </div>
                                    <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                        <!-- Heavy Drinkers -->
                                        <input type="radio" name="drinkers-type" id="heavy-drinkers" v-model="drinkType" value="Heavy Drinkers"/>
                                        <label class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" for="heavy-drinkers">Heavy Drinkers (1.5 drinks/hr)</label>
                                    </div>
                                    <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                        <!-- Very Heavy Drinkers -->
                                        <input type="radio" name="drinkers-type" id="very-heavy-drinkers" v-model="drinkType" value="Very Heavy Drinkers"/>
                                        <label class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer" for="very-heavy-drinkers">Very Heavy Drinkers (2+ drinks/hr)</label>
                                    </div>
                                </div>
                            </div>

                            <div class="sm:col-span-3">
                                <!-- Beer Preference Slider -->
                                <label for="beer-preference" class="block text-sm font-medium leading-6 text-gray-900">Percentage of Guests Who Prefer Beer?</label>
                                <label for="beer-preference" class="mb-2 inline-block text-neutral-700 dark:text-neutral-200">For events with cocktails, the industry standard is about 30%</label>
                                <input type="range" id="beer-preference" v-model.number="beerPreference" class="transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600" />
                            </div>

                            <div class="sm:col-span-3">
                                <!-- Wine Preference Slider -->
                                <label for="wine-preference" class="block text-sm font-medium leading-6 text-gray-900">Percentage of Guests Who Prefer Wine?</label>
                                <label for="wine-preference" class="mb-2 inline-block text-neutral-700 dark:text-neutral-200">For events with cocktails, the industry standard is about 20%</label>
                                <input type="range" id="wine-preference" v-model.number="winePreference" class="transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600" />
                            </div>

                            <div class="sm:col-span-3">
                                <!-- Cocktails Preference Slider -->
                                <label for="cocktail-preference" class="block text-sm font-medium leading-6 text-gray-900">Percentage of Guests Who Prefer Cocktails</label>
                                <label for="cocktail-preference" class="mb-2 inline-block text-neutral-700 dark:text-neutral-200">If you're having signature cocktails, the industry standard is 60%. If you're just having a full bar, the industry standard is 50%</label>
                                <input type="range" id="cocktail-preference" v-model.number="cocktailPreference" class="transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600" />
                            </div>

                        </div>
                        </div>
                
                        
                    </div>

                    <!-- Display the calculated results in a table format -->
                    <div class="mt-10">
                        <h2 class="text-xl font-semibold mb-4">Estimated Alcohol Requirements</h2>
                        <table class="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    <th class="border px-4 py-2">NAME</th>
                                    <th class="border px-4 py-2">SERVINGS</th>
                                    <th class="border px-4 py-2">PURCHASE (EACH)</th>
                                    <th class="border px-4 py-2">CASE/S</th>
                                    <th class="border px-4 py-2">EST. COST</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border px-4 py-2">Beer (12 oz Cans/Bottles)</td>
                                    <td class="border px-4 py-2">{{ calculatedResults.beer }}</td>
                                    <td class="border px-4 py-2">{{ calculatedResults.beerBottles }} bottles</td>
                                    <td class="border px-4 py-2">{{ (calculatedResults.beerCases).toFixed(2) }} cases</td> <!-- Assuming 24 cans/bottles per case -->
                                    <td class="border px-4 py-2">{{ calculatedResults.beerCost.toFixed(2) }}</td> <!-- This assumes you've added beerCost to calculatedResults -->
                                </tr>
                                <tr>
                                    <td class="border px-4 py-2">Wine (750ml Bottles)</td>
                                    <td class="border px-4 py-2">{{ calculatedResults.wine }}</td>
                                    <td class="border px-4 py-2">{{ calculatedResults.wineBottles }} bottles</td>
                                    <td class="border px-4 py-2">{{ (calculatedResults.wineCases).toFixed(2) }} cases</td> <!-- Assuming 12 bottles per case -->
                                    <td class="border px-4 py-2">{{ calculatedResults.wineCost.toFixed(2) }}</td> <!-- This assumes you've added wineCost to calculatedResults -->
                                </tr>
                                <tr>
                                    <td class="border px-4 py-2">Liquor (750ml bottles)</td>
                                    <td class="border px-4 py-2">{{ calculatedResults.liquor }}</td>
                                    <td class="border px-4 py-2">{{ calculatedResults.liquorBottles }} bottles</td>
                                    <td class="border px-4 py-2">N/A</td>
                                    <td class="border px-4 py-2">{{ calculatedResults.liquorCost.toFixed(2) }}</td> <!-- This assumes you've added liquorCost to calculatedResults -->
                                </tr>
                                <tr>
                                    <td class="border px-4 py-2 font-semibold" colspan="4">Total Est. Alcohol Cost</td>
                                    <td class="border px-4 py-2">{{ calculatedResults.totalCost.toFixed(2) }}</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                
                    <div class="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Email Details</button>
                    </div>
                </form>
            </div>
            <!-- End of Card -->
        </div>
    </div>
  </template>
