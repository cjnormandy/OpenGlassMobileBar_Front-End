<template>
  <div class="absolute inset-x-0 top-40 z-1">
    <!-- Banner -->
    <div class="relative overflow-hidden bg-cover bg-no-repeat bg-center p-12 text-center" style="background-image: url('/ordersbanner.jpg'); padding-bottom: 20%;">
        <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style="background-color: rgba(0, 0, 0, 0.6)">
            <div class="flex h-full items-center justify-center">
                <div class="text-white">
                  <h2 class="mb-4 text-4xl font-semibold">Orders</h2>
                </div>
            </div>
        </div>
    </div>
    <!--Orders Content-->
      <div class="w-full">
        <h1></h1><!--No Table Title-->
        <div class="border border-gray-200 p-2">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Drinks
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orderItems" :key="order.order_details_id">
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== order.order_details_id">
                  {{ order.customer_id }}
                </template>
                <input v-else v-model="editedOrder.customer_id" placeholder="customerID">
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== order.order_details_id">
                  {{ order.service_id }}
                </template>
                <select v-else v-model="editedOrder.service_id" @change="handleServiceChangeDuringEdit">
                  <option value="1">Simple Glass</option>
                  <option value="2">Premium Glass</option>
                  <option value="3">Signature Glass</option>
                  <option value="4">Open Glass</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== order.order_details_id">
                  {{ order.order_description }}
                </template>
                <input v-else v-model="editedOrder.order_description" placeholder="desc" style="width: 100%;">
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== order.order_details_id">
                  <div v-for="drink in order.drinks" :key="drink.drink_name">
                    {{ drink.drink_name }}
                  </div>
                </template>
                <template v-else>
                  <div v-for="n in editDrinkSelectionLimit" :key="n">
                    <select v-model="editedOrder.drinks[n - 1]">
                      <option disabled value="">Select a Drink</option>
                      <option v-for="drink in availableDrinks" :value="drink.id">{{ drink.name }}</option>
                    </select>
                  </div>
                </template>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== order.order_details_id">
                  <!--Unused Edit Button and function-->
                  <!--<button @click="editOrder(order)" class="text-green-500 hover:text-green-700">Edit</button> - -->
                  <button @click="deleteOrder(order)" class="text-red-500 hover:text-red-700">Delete</button>
                </template>
                <template v-else>
                  <button @click="updateOrderItem(order)" class="text-indigo-500 hover:text-indigo-700">Save</button> -
                  <button @click="cancelEdit">Cancel</button>
                </template>
              </td>
            </tr>
            <!-- Add Order Section -->
            <tr>
              <td><input v-model="newOrderItem.customer_id" placeholder="Pre-existing Customer ID"></td>
              <td>
                <select v-model="newOrderItem.service_id" @change="updateDrinkSelections">
                  <option disabled value="">Select a Service</option>
                  <option value="1">Simple Glass</option>
                  <option value="2">Premium Glass</option>
                  <option value="3">Signature Glass</option>
                  <option value="4">Open Glass</option>
                </select>
              </td>
              <td><input v-model="newOrderItem.order_description" placeholder="Description" style="width: 100%;"></td>
              <td>
                <div v-for="n in drinkSelectionLimit" :key="n">
                  <select v-model="newOrderItem.drinks[n - 1]">
                    <option disabled value="">Select a Drink</option>
                    <option v-for="drink in availableDrinks" :value="drink.id">{{ drink.name }}</option>
                  </select>
                </div>
              </td>
              <td><button @click="addOrderItem" class="text-indigo-400 hover:text-indigo-700">Add</button></td>
            </tr>
            <!-- Display error message if any -->
            <tr v-if="errorMessage">
              <td colspan="5" class="text-red-500">{{ errorMessage }}</td>
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
      editingItemId: null,
      editedOrder: null,
      orderItems: [],
      errorMessage: '', // Add a property for error messages
      newOrderItem: {
        customer_id: '',
        service_id: '',
        order_description: '',
        drinks: ''
      },
      availableDrinks: [],
      drinkSelectionLimit: 0,
      editDrinkSelectionLimit: 0,
    };
  },

  //GET METHOD
  methods: {
    async fetchOrders() {
      const backendUrl = 'http://localhost:3000';
      const apiUrl = `${backendUrl}/orders`;
      try {
      const response = await axios.get(apiUrl);
      this.orderItems = response.data;
      console.log('Orders fetched:', this.orderItems); // For debugging
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
    },

    isDrinkInOrder(orderId, drinkId) {
      const order = this.orderItems.find(o => o.order_details_id === orderId);
      return order && order.drinks.some(d => d.drink_id === drinkId);
    },

  //POST METHOD
  async addOrderItem() {
    const backendUrl = 'http://localhost:3000';
    const apiUrl = `${backendUrl}/createOrder`;
    this.errorMessage = ''; // Reset error message

    // Validate input data
    if (!this.newOrderItem.customer_id || !this.newOrderItem.service_id || !this.newOrderItem.order_description || !this.newOrderItem.drinks.length) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    // Ensure no duplicate drinks are being sent
    if (this.hasDuplicateDrinks(this.newOrderItem.drinks)) {
      this.errorMessage = 'Duplicate drinks detected. Please select each drink only once.';
      return;
    }

    // Map drink IDs to names
    const drinkNames = this.newOrderItem.drinks
      .filter(drinkID => drinkID !== null)
      .map(drinkID => {
        const drink = this.availableDrinks.find(d => d.id === drinkID);
        return drink ? drink.name : null;
      });

    // Prepare request data
    const requestData = {
      customerID: this.newOrderItem.customer_id,
      serviceID: this.newOrderItem.service_id,
      desc: this.newOrderItem.order_description,
      drinks: drinkNames
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 201) {
        this.fetchOrders(); // Refresh the orders data
        this.resetNewOrderItem(); // Reset form
      } else {
        this.errorMessage = 'Failed to add order. Please check your input.';
      }
    } catch (error) {
      console.error('Error adding order item:', error);
      this.errorMessage = error.response?.data?.message || 'Error adding order item.';
    }
  },

    // Helper Methods
    hasDuplicateDrinks(drinks) {
      const uniqueDrinks = new Set(drinks);
      return uniqueDrinks.size !== drinks.length;
    },

    resetNewOrderItem() {
      this.newOrderItem = {
        customer_id: '',
        service_id: '',
        order_description: '',
        drinks: []
      };
    },

  // PUT METHOD HELPER 1 - Edit Order
  editOrder(order) {
    this.editingItemId = order.order_details_id;
    this.editedOrder = { ...order };

    // Set initial editDrinkSelectionLimit based on the service
    this.updateEditDrinkSelections(this.editedOrder.service_id);

    // Map existing drinks to their IDs
    this.editedOrder.drinks = order.drinks.map(drink => {
      const foundDrink = this.availableDrinks.find(d => d.name === drink.drink_name);
      return foundDrink ? foundDrink.id : '';
    });
  },

   // PUT METHOD HELPER 2 - Update Edit Drink Selections
    updateEditDrinkSelections(serviceId) {
      // Define limits based on service ID
      const limits = { '1': 2, '2': 3, '3': 5, '4': 5 };
      const limit = limits[serviceId] || 0;

      this.editDrinkSelectionLimit = limit;

      // Adjust the length of editedOrder.drinks to match the limit
      this.editedOrder.drinks = this.editedOrder.drinks.slice(0, limit);
      while (this.editedOrder.drinks.length < limit) {
        this.editedOrder.drinks.push('');
      }
    },

     // Handle Service Change During Edit
     handleServiceChangeDuringEdit() {
      this.updateEditDrinkSelections(this.editedOrder.service_id);
    },

    //PUT METHOD CANCEL
    cancelEdit() {
      console.log('Cancel button clicked for order:', this.editingItemId);
      this.editingItemId = null;
      this.editedOrder = null;
    },

    //PUT METHOD
    async updateOrderItem() {
      if (!this.editedOrder) {
        console.error('No edited order to update.');
        return;
      }

      const backendUrl = 'http://localhost:3000';
      console.log('Order details ID:', this.editedOrder.order_details_id);
      const apiUrl = `${backendUrl}/updateOrder/${this.editedOrder.order_details_id}`;
      console.log('Making PUT request to:', apiUrl);
      const drinkNameToSend = this.editedOrder.drinks.length > 0 ? this.editedOrder.drinks[0] : null;

      const requestData = {
        customerID: parseInt(this.editedOrder.customer_id),
        serviceID: parseInt(this.editedOrder.service_id),
        desc: this.editedOrder.order_description,
        drinkName: drinkNameToSend
      };
      console.log('Request Data:', requestData);

      try {
        const response = await axios.put(apiUrl, requestData, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
          // Find the index of the updated order in orderItems
          const updatedOrderIndex = this.orderItems.findIndex(order => order.order_details_id === this.editedOrder.order_details_id);
          
          this.orderItems.splice(updatedOrderIndex, 1, { ...this.editedOrder });
          this.editingItemId = null;
          this.editedOrder = null;
        } else {
          console.error('Error updating orders item. Status:', response.status, 'Response:', response.data);
        }
      } catch (error) {
        console.error('Error updating orders item:', error);
      }
    },

    //DELETE METHOD
    async deleteOrder(order) {
      const backendUrl = 'http://localhost:3000';
      const orderID = order.order_details_id;
      const deleteOrderUrl = `${backendUrl}/deleteOrder/${orderID}`;
      const deleteRelationshipsUrl = `${backendUrl}/deleteAllOrderRelationships/${orderID}`;
      
      try {
    // Step 1: Delete Drink Relationships
    const deleteRelationshipsResponse = await axios.delete(deleteRelationshipsUrl);
    if (deleteRelationshipsResponse.status === 200) {
      // Relationships deleted successfully, proceed to delete the order
      const deleteOrderResponse = await axios.delete(deleteOrderUrl);

      if (deleteOrderResponse.status === 200) {
        // Order deleted successfully, update the orders list
        this.fetchOrders();
      } else {
        console.error('Error deleting orders item:', deleteOrderResponse.data);
      }
    } else {
      console.error('Error deleting order relationships:', deleteRelationshipsResponse.data);
    }
    } catch (error) {
      console.error('Error deleting orders item:', error);
    }
    },

    async fetchAvailableDrinks() {
      const backendUrl = 'http://localhost:3000';
      const apiUrl = `${backendUrl}/drinks`;
      try {
        const response = await axios.get(apiUrl);
        this.availableDrinks = response.data.map(drink => ({ 
          id: drink.drink_id, // Assuming your drink object has 'drink_id'
          name: drink.drink_name // Assuming your drink object has 'drink_name'
        }));
      } catch (error) {
        console.error('Error fetching available drinks:', error);
      }
    },

    updateDrinkSelections() {
      // Update the number of drink selections based on the service ID
      switch (this.newOrderItem.service_id) {
        case '1': this.drinkSelectionLimit = 2; break;
        case '2': this.drinkSelectionLimit = 3; break;
        case '3': this.drinkSelectionLimit = 5; break;
        case '4': this.drinkSelectionLimit = 5; break;
        default: this.drinkSelectionLimit = 0;
      }
      // Reset the drinks array to match the selection limit
      this.newOrderItem.drinks = new Array(this.drinkSelectionLimit).fill('');
    },

  },

  created() {
    this.fetchOrders();
    this.fetchAvailableDrinks();
  },
};
</script>
  
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc; /* Add a thin border to table cells */
  padding: 5px;
  text-align: left;
}
</style>