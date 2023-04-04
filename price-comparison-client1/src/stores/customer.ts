import type { ICustomer } from '@/domain/ICustomer'
import { defineStore } from 'pinia'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useCustomerStore = defineStore({
    id: 'customers',
    state: () => ({
        customer: [] as ICustomer,
        customers: [] as ICustomer[],
    }),
    getters: {
        customerCount: (state) => state.customers.length,
    },
    actions: {
        add (customer: ICustomer) {
            this.customers.push(customer)
        }
    },
})
