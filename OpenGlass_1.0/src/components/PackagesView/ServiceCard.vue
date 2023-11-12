<template>
    <div @click="select" class="max-w-xs w-full lg:max-w-1/3 lg:flex">
        <div class="border-r border-b border-l border-gray-400 lg:border-l lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div class="mb-8">
                <div class="text-gray-900 font-bold text-xl mb-2">{{ service.title }}</div>
                <p class="text-gray-700 text-base" v-for="descItem in service.description" :key="descItem">
                    {{ descItem }}
                </p>

                <h3 class="p-3 font-semibold">Services Included</h3>
                <ul class="list-disc pl-5">
                    <li v-for="includedService in service.included_services" :key="includedService">
                        {{ includedService }}
                    </li>
                </ul>

                <p class="p-3 text-gray-700 font-semibold">
                    *PACKAGE DOES NOT INCLUDE ALCOHOL
                </p>
            </div>
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