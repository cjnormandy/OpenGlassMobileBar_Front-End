<template>
    <div class="bg-white border rounded-lg shadow p-6">
        <!-- Calendar Header: Month and Year -->
        <div class="flex justify-between items-center mb-4">
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2">
                <span class="sr-only">Previous month</span>
                &lt;
            </button>
            <h2 class="text-xl font-semibold">September 2023</h2>
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2">
                <span class="sr-only">Next month</span>
                &gt;
            </button>
        </div>

        <!-- Days of the Week -->
        <div class="grid grid-cols-7 gap-4 mb-4">
            <div class="text-center font-medium">Sun</div>
            <div class="text-center font-medium">Mon</div>
            <div class="text-center font-medium">Tue</div>
            <div class="text-center font-medium">Wed</div>
            <div class="text-center font-medium">Thu</div>
            <div class="text-center font-medium">Fri</div>
            <div class="text-center font-medium">Sat</div>
        </div>

        <!-- Days of the Month -->
        <div class="grid grid-cols-7 gap-4">
            <!-- Example day cell (repeat for each day) -->
            <div class="text-center border rounded-full py-2 px-4 hover:bg-gray-100">
                1
            </div>
            <!-- ... -->
        </div>
    </div>
</template>