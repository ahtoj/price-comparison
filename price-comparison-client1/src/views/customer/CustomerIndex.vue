<template>
    <h2>List of customers</h2>
    <p>
        <RouterLink :to="{ name: 'customers-create' }">Create new</RouterLink>
    </p>
    <table class="table">
        <thead>
        <tr>
            <th>Id</th>
            <th>Customer Id</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item of customersStore.customers" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.id }}</td>
            <td>
                <RouterLink :to="{ name: 'customers-details', params: { id: item.id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'customers-edit', params: { id: item.id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'customers-delete', params: { id: item.id } }">Delete</RouterLink>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { CustomerService } from '@/bll/service/CustomerService'
import { useCustomerStore } from '@/stores/customer'
import Logger from '@/util/logger'
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    setup() {
        const logger = new Logger("CustomerIndex")
        const customersStore = useCustomerStore()
        const customerService = new CustomerService()

        return {
            logger,
            customersStore,
            customerService,
        }
    }
})

</script>
