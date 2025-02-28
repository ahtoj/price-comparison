<template>
    <h2>Details customer {{ id }}</h2>
    <div class="row">
        <div class="col-md-12">
            <div>
                <RouterLink :to="{ name: 'customers-details', params: { id: id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'customers-edit', params: { id: id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'customers-delete', params: { id: id } }">Delete</RouterLink>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'customers' }">Back to Customers</RouterLink>
    </div>
</template>

<script lang="ts">
import { CustomerService } from '@/bll/service/CustomerService'
import { useCustomerStore } from '@/stores/customer'
import Logger from '@/util/logger'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {
        id: String
    },
    emits: [],
    setup() {
        const logger = new Logger("CustomerDetails")
        const customersStore = useCustomerStore()
        const customerService = new CustomerService()

        onMounted(() => {
            logger.info('mounted')
            // this.customersStore.$state.customer =
            //     await this.customerService.get(this.id)
        })

        return {
            logger,
            customersStore,
            customerService
        }
    }
})

</script>
