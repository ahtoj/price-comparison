<template>
    <h4>Delete customer {{ id }}</h4>
    <div class="row">
        <div class="col-md-12">

            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Delete" class="btn btn-primary"/>
                </div>
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
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {
        id: Number,
    },
    emits: [],
    setup(props: any) {
        const logger = new Logger("CustomerDelete")
        const customersStore = useCustomerStore()
        const customerService = new CustomerService()
        const id = props.id

        let errorMsg: string | null = null
        return {
            logger,
            customersStore,
            customerService,
            errorMsg,
            id,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            await this.customerService.delete(this.id)

            /*
            if (res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                this.customersStore.$state.customers =
                    await this.customerService.getAll()

                this.$router.push('/customers')
            }
             */
        }
    }
})
</script>
