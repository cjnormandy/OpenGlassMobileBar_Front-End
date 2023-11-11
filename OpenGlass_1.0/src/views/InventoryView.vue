<template>
  <div class="absolute inset-x-0 top-40 z-1">
    <!-- Banner -->
    <div class="relative overflow-hidden bg-cover bg-no-repeat bg-center p-12 text-center" style="background-image: url('/inventorybanner.jpg'); padding-bottom: 20%;">
        <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style="background-color: rgba(0, 0, 0, 0.6)">
            <div class="flex h-full items-center justify-center">
                <div class="text-white">
                  <h2 class="mb-4 text-4xl font-semibold">Inventory</h2>
                </div>
            </div>
        </div>
    </div>
    <!--Inventory Content-->
      <div class="w-full">
        <h1></h1><!--No Table Title-->
        <div class="border border-gray-200 p-2">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-s leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="drink in inventoryItems" :key="drink.inventory_id">
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== drink.inventory_id">
                  {{ drink.inventory_name }}
                </template>
                <input v-else v-model="editedDrink.inventory_name" placeholder="Name">
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== drink.inventory_id">
                  {{ drink.inventory_type }}
                </template>
                <input v-else v-model="editedDrink.inventory_type" placeholder="Type">
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== drink.inventory_id">
                  {{ drink.inventory_size }}
                </template>
                <input v-else v-model="editedDrink.inventory_size" placeholder="Size">
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== drink.inventory_id">
                  {{ drink.inventory_price }}
                </template>
                <input v-else v-model="editedDrink.inventory_price" placeholder="Price">
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== drink.inventory_id">
                  {{ drink.inventory_quantity }}
                </template>
                <input v-else v-model="editedDrink.inventory_quantity" placeholder="Quantity">
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== drink.inventory_id">
                  {{ drink.invoice_id }}
                </template>
                <input v-else v-model="editedDrink.invoice_id" placeholder="ID">
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
                <template v-if="editingItemId !== drink.inventory_id">
                  <button @click="editDrink(drink)" class="text-green-500 hover:text-green-700">Edit</button> -
                  <button @click="deleteDrink(drink)" class="text-red-500 hover:text-red-700">Delete</button>
                </template>
                <template v-else>
                  <button @click="updateInventoryItem(drink)" class="text-indigo-500 hover:text-indigo-700">Save</button> -
                  <button @click="cancelEdit">Cancel</button>
                </template>
              </td>
            </tr>
            <tr>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
              <input v-model="newInventoryItem.inventory_name" placeholder="Name">
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
              <input v-model="newInventoryItem.inventory_type" placeholder="Type">
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
              <input v-model="newInventoryItem.inventory_size" placeholder="Size">
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
              <input v-model="newInventoryItem.inventory_price" placeholder="Price">
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
              <input v-model="newInventoryItem.inventory_quantity" placeholder="Quantity">
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">
              <input v-model="newInventoryItem.invoice_id" placeholder="Pre-existing Invoice ID">
            </td>
            <td class="px-6 py-4 whitespace-no-wrap">
              <button @click="addInventoryItem" class="text-indigo-400 hover:text-indigo-700">Add</button>
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
      editingItemId: null,
      editedDrink: null,
      inventoryItems: [],
      newInventoryItem: {
        inventory_name: '',
        inventory_type: '',
        inventory_size: '',
        inventory_price: '',
        inventory_quantity: '',
        invoice_id: ''
      }
    };
  },

  //GET METHOD
  methods: {
    async fetchInventory() {
      const backendUrl = 'http://localhost:3000';
      const apiUrl = `${backendUrl}/inventory`;
      try {
      const response = await axios.get(apiUrl);
      this.inventoryItems = response.data;
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
    },

    //POST METHOD
    async addInventoryItem() {
      const backendUrl = 'http://localhost:3000';
      const apiUrl = `${backendUrl}/addInvItem`;
      
      const requestData = {
        name: this.newInventoryItem.inventory_name,
        type: this.newInventoryItem.inventory_type,
        size: this.newInventoryItem.inventory_size,
        price: this.newInventoryItem.inventory_price,
        quantity: this.newInventoryItem.inventory_quantity,
        invoiceID: this.newInventoryItem.invoice_id,
      };
      
      try {
        const response = await axios.post(apiUrl, requestData, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 201) {
          this.fetchInventory(); // Refresh the inventory data
          this.newInventoryItem = {
            inventory_name: '',
            inventory_type: '',
            inventory_size: '',
            inventory_price: '',
            inventory_quantity: '',
            invoice_id: '',
          };
        }
      } catch (error) {
        console.error('Error adding inventory item:', error);
      }
    },

    //PUT METHOD HELPER 1
    editDrink(drink) {
      console.log('Edit button clicked for drink:', drink);
      this.editingItemId = drink.inventory_id;
      this.editedDrink = { ...drink };
    },
    //PUT METHOD HELPER 2
    cancelEdit() {
      this.editingItemId = null;
      this.editedDrink = null;
    },

    //PUT METHOD
    async updateInventoryItem(drink) {
      if (!this.editedDrink) {
        console.error('No edited drink to update.');
        return;
      }

      const backendUrl = 'http://localhost:3000'; // Updated with the correct backend URL and port
      const apiUrl = `${backendUrl}/updateInventory/${this.editedDrink.inventory_id}`;

      const requestData = {
        name: this.editedDrink.inventory_name,
        type: this.editedDrink.inventory_type,
        size: this.editedDrink.inventory_size,
        price: this.editedDrink.inventory_price,
        quantity: this.editedDrink.inventory_quantity,
        invoiceID: this.editedDrink.invoice_id,
      };

      try {
        const response = await axios.put(apiUrl, requestData, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
          this.fetchInventory(); // Refresh the inventory data
          this.editingItemId = null; // Exit editing mode
          this.editedDrink = null; // Clear the editedDrink
        } else {
          console.error('Error updating inventory item. Response:', response.data);
        }
      } catch (error) {
        console.error('Error updating inventory item:', error);
      }
    },

    //DELETE METHOD
    async deleteDrink(drink) {
      const backendUrl = 'http://localhost:3000';
      const apiUrl = `${backendUrl}/deleteInventory/${drink.inventory_id}`;
      
      try {
      const response = await axios.delete(apiUrl);

      if (response.status === 200) {
        this.fetchInventory();
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
    
    
    }
  },

  created() {
    this.fetchInventory();
  },
};
</script>
  
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 5px;
  text-align: left;
}
</style>