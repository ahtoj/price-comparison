<template>
    <h4>Create customer</h4>
    <div class="row">
        <div class="col-md-12">

            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Create" class="btn btn-primary"/>
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
import router from "@/router";
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {},
    emits: [],
    setup() {
        const logger = new Logger("CustomerCreate")
        const customersStore = useCustomerStore()
        const customerService = new CustomerService()

        let errorMsg = ""

        return {
            logger,
            customersStore,
            customerService,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            const res = await this.customerService.add(
                {}
            )

            if (res.status == null || res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                // this.customersStore.$state.customers =
                //     await this.customerService.getAll()

                await router.push('/customers')
            }
        }
    }

})
</script>
