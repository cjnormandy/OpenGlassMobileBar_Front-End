import { defineStore } from 'pinia';
import axios from 'axios';

export const usePaymentStore = defineStore({
    id: 'payment',
    state: () => ({
        // Define your state properties here
    }),
    actions: {
        async addCustomer(customerData, transData) {
            try {
                const response = await axios.post('http://localhost:3000/Addcustomers', customerData);
                // Handle the response, update state, etc.
                console.log(response.data.message);

                const phone = customerData.phone;
                const customer = await axios.get(`http://localhost:3000/customers/by-phone/${phone}`);
                
                const cust_id = customer.data.customer_id;
                transData.customer_id = cust_id;
                const trans = await axios.post('http://localhost:3000/createtransaction', transData);


            } catch (error) {
                console.error('Error adding customer:', error);
            }
        }
    },
});
