<template>
  <div class="absolute inset-x-0 top-40 z-1">
    <!-- Jumbotron -->
    <div class="relative overflow-hidden bg-cover bg-no-repeat bg-center p-12 text-center" style="background-image: url('/inventorybanner.jpg'); padding-bottom: 20%;"> 
        <!-- This padding value of 56.25% gives a 16:9 aspect ratio. Adjust as needed. -->
        <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed" style="background-color: rgba(0, 0, 0, 0.6)">
            <div class="flex h-full items-center justify-center">
                <div class="text-white">
                  <h2 class="mb-4 text-4xl font-semibold">Inventory</h2>
                </div>
            </div>
        </div>
    </div>
    <!--Content-->
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
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">{{ drink.inventory_name }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">{{ drink.inventory_type }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">{{ drink.inventory_size }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">{{ drink.inventory_price }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">{{ drink.inventory_quantity }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-r border-gray-200">{{ drink.invoice_id }}</td>
            <td class="px-6 py-4 whitespace-no-wrap">
                
              <!--- <button @click="editDrink(drink)">Edit</button> --->
              <button @click="deleteDrink(drink)" class="text-red-500 hover:text-red-700">Delete</button>
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
        
        <!-- Unused Edit Form -->
        <!-- <div v-if="isEditing">
          <input v-model="editedDrink.inventory_name" placeholder="Name">
          <input v-model="editedDrink.inventory_type" placeholder="Type">
          <input v-model="editedDrink.inventory_size" placeholder="Size">
          <input v-model="editedDrink.inventory_price" placeholder="Price">
          <input v-model="editedDrink.inventory_quantity" placeholder="Quantity">
          <input v-model="editedDrink.invoice_id" placeholder="Pre-existing Invoice ID">
          <button @click="updateInventoryItem">Update Drink</button>
          <button @click="cancelEdit">Cancel</button>
        </div> -->
      </div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      isEditing: false,
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

  methods: {
    async fetchInventory() {
      const backendUrl = 'http://localhost:3000'; // Updated with the correct backend URL and port
      const apiUrl = `${backendUrl}/inventory`;
      try {
      const response = await axios.get(apiUrl);
      this.inventoryItems = response.data;
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
    },

    async addInventoryItem() {
      const backendUrl = 'http://localhost:3000'; // Updated with the correct backend URL and port
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

    async editDrink(drink) {
      console.log('Edit button clicked for drink:', drink);
      this.editedDrink = { ...drink };
      this.isEditing = true;
    },

    async cancelEdit() {
      this.isEditing = false;
      this.editedDrink = null;
    },

    async updateInventoryItem() {
      const backendUrl = 'http://localhost:3000'; // Updated with the correct backend URL and port
      const apiUrl = `${backendUrl}/updateInventory/${this.editedDrink.inventory_id}`;

      try {
        const response = await axios.put(apiUrl, this.editedDrink, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
          this.fetchInventory(); // Refresh the inventory data
          this.isEditing = false; // Hide the edit form
          this.editedDrink = null; // Clear the editedDrink
        }
      } catch (error) {
        console.error('Error updating inventory item:', error);
      }
    },

    async deleteDrink(drink) {
      const backendUrl = 'http://localhost:3000';
      const apiUrl = `${backendUrl}/deleteInventory/${drink.inventory_id}`;
      
      try {
      const response = await axios.delete(apiUrl);

      if (response.status === 200) {
        // Item deleted successfully, update the inventory list
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
  border: 1px solid #ccc; /* Add a thin border to table cells */
  padding: 5px;
  text-align: left;
}
</style>