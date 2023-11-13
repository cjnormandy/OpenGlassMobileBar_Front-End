<template>
    <div class="absolute inset-x-0 top-40 z-1">
        <!-- Banner -->
        <div class="relative overflow-hidden bg-cover bg-no-repeat bg-center p-12 text-center"
            style="background-image: url('/eventbanner.jpg'); padding-bottom: 20%;">
            <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed"
                style="background-color: rgba(0, 0, 0, 0.6)">
                <div class="flex h-full items-center justify-center">
                    <div class="text-white">
                        <h2 class="mb-4 text-4xl font-semibold">Events</h2>
                    </div>
                </div>
            </div>
        </div>
        <!-- Event Content -->
        <div class="w-full">
            <h1></h1><!-- No Table Title -->
            <div class="border border-gray-200 p-2">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Start Time
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                End Time
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Customer ID
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Order Details ID
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Payment ID
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Payment Status
                            </th>
                            <th
                                class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="event in events" :key="event.event_id">
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <!-- Display or edit 'Name' -->
                                <template v-if="editingEventId !== event.event_id">
                                    {{ event.event_name }}
                                </template>
                                <input v-else v-model="editedEvent.event_name" placeholder="Name" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <!-- Display or edit 'Description' -->
                                <template v-if="editingEventId !== event.event_id">
                                    {{ event.event_description }}
                                </template>
                                <input v-else v-model="editedEvent.event_description" placeholder="Description" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                {{ event.event_date }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                {{ event.event_start_time }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                {{ event.event_end_time }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                {{ event.location }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                {{ event.customer_id }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                {{ event.order_details_id }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                {{ event.payment_id }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                {{ event.payment_status }}
                            </td>
                            <!-- Add more cells as needed -->
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <template v-if="editingEventId !== event.event_id">
                                    <button @click="editEvent(event)"
                                        class="text-green-500 hover:text-green-700">Edit</button> -
                                    <button @click="deleteEvent(event)"
                                        class="text-red-500 hover:text-red-700">Delete</button>
                                </template>
                                <template v-else>
                                    <button @click="updateEvent(event)"
                                        class="text-indigo-500 hover:text-indigo-700">Save</button> -
                                    <button @click="cancelEdit">Cancel</button>
                                </template>
                            </td>
                        </tr>
                        <!-- Add a new row for adding events -->
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.event_name" placeholder="Name" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.event_description" placeholder="Description" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.event_date" placeholder="Date" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.event_start_time" placeholder="Start Time" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.event_end_time" placeholder="End Time" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.location" placeholder="Location" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.customer_id" placeholder="Customer ID" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.order_details_id" placeholder="Order Details ID" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.payment_id" placeholder="Payment ID" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <input v-model="newEvent.payment_status" placeholder="Payment Status" />
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                                <button @click="addEvent" class="text-indigo-400 hover:text-indigo-700">Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            editingEventId: null,
            editedEvent: null,
            events: [],
            newEvent: {
                event_name: '',
                event_description: '',
                event_date: '',
                event_start_time: '',
                event_end_time: '',
                location: '',
                customer_id: '',
                order_details_id: '',
                payment_id: '',
                payment_status: '',
            },
        };
    },

    // GET METHOD
    methods: {
        async fetchEvents() {
            const backendUrl = 'http://localhost:3000';
            const apiUrl = `${backendUrl}/events`;
            try {
                const response = await axios.get(apiUrl);
                this.events = response.data;
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        },

        // POST METHOD
        async addEvent() {
            const backendUrl = 'http://localhost:3000';
            const apiUrl = `${backendUrl}/createEvent`;

            const requestData = {
                event_name: this.newEvent.event_name,
                event_description: this.newEvent.event_description,
                event_date: this.newEvent.event_date,
                event_start_time: this.newEvent.event_start_time,
                event_end_time: this.newEvent.event_end_time,
                location: this.newEvent.location,
                customer_id: this.newEvent.customer_id,
                order_details_id: this.newEvent.order_details_id,
                payment_id: this.newEvent.payment_id,
                payment_status: this.newEvent.payment_status,
            };

            try {
                const response = await axios.post(apiUrl, requestData, {
                    headers: { 'Content-Type': 'application/json' },
                });

                // Assuming that a successful response has a status of 201
                if (response.status === 201) {
                    this.fetchEvents(); // Refresh the events data
                    this.newEvent = {
                        event_name: '',
                        event_description: '',
                        event_date: '',
                        event_start_time: '',
                        event_end_time: '',
                        location: '',
                        customer_id: '',
                        order_details_id: '',
                        payment_id: '',
                        payment_status: '',
                    };
                }

            } catch (error) {
                console.error('Error adding event:', error);
                // Handle error, show a message, etc.
            }
        },

        // Helper method to initiate the editing mode
        editEvent(event) {
            console.log('Edit button clicked for event:', event);
            this.editingEventId = event.event_id;
            this.editedEvent = { ...event };
        },

        // Helper method to cancel the editing mode
        cancelEdit() {
            this.editingEventId = null;
            this.editedEvent = null;
        },

        // Main method to update the event
        async updateEvent(event) {
            if (!this.editedEvent) {
                console.error('No edited event to update.');
                return;
            }

            const backendUrl = 'http://localhost:3000';
            const apiUrl = `${backendUrl}/updateEvent/${this.editedEvent.event_id}`;

            const requestData = {
                event_name: this.editedEvent.event_name,
                event_description: this.editedEvent.event_description,
                event_date: this.editedEvent.event_date,
                event_start_time: this.editedEvent.event_start_time,
                event_end_time: this.editedEvent.event_end_time,
                location: this.editedEvent.location,
                customer_id: this.editedEvent.customer_id,
                order_details_id: this.editedEvent.order_details_id,
                payment_id: this.editedEvent.payment_id,
                payment_status: this.editedEvent.payment_status,
            };

            console.log('Update Event Request Data:', requestData);

            try {
                const response = await axios.put(apiUrl, requestData, {
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.status === 200) {
                    this.fetchEvents(); // Refresh the events data
                    this.editingEventId = null; // Exit editing mode
                    this.editedEvent = null; // Clear the editedEvent
                } else {
                    console.error('Error updating event. Response:', response.data);
                }
            } catch (error) {
                console.error('Error updating event:', error);
            }
        },

        // Other methods (fetchEvents, addEvent, deleteEvent) remain unchanged




        // DELETE METHOD
        async deleteEvent(event) {
            const backendUrl = 'http://localhost:3000';
            const apiUrl = `${backendUrl}/deleteEvent/${event.event_id}`;

            try {
                const response = await axios.delete(apiUrl);

                // Assuming that a successful response has a status of 200
                if (response.status === 200) {
                    this.fetchEvents(); // Refresh the events data
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                // Handle error, show a message, etc.
            }
        }
    },
    created() {
        this.fetchEvents();
    },
};

</script>
  
<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ccc;
    padding: 5px;
    text-align: left;
}
</style>
  