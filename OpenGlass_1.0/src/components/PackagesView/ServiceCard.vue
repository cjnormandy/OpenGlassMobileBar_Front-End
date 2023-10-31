<template>
    <div @click="select" class="flex bg-white p-4 rounded shadow-lg cursor-pointer hover:bg-gray-50 mt-12 h-full">
        <div class="flex-1">
            <img class="object-cover w-full h-full rounded-l" :src="service.image" alt="Service Image">
        </div>
        <div class="flex-1 p-6">
            <div class="font-bold text-xl mb-2">{{ service.title }}</div>
            <ul class="text-gray-700 text-base text-left">
                <li v-for="descItem in service.description" :key="descItem">{{ descItem }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        service: Object,
    },
    methods: {
        select() {
            this.$emit('selectService', this.service);
        }
    }
};
</script>