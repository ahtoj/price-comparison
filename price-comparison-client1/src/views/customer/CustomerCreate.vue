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
import { Options, Vue } from 'vue-class-component'
import Logger from '@/util/logger'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Options({
    components: {},
    props: {},
    emits: [],
})
export default class CustomerCreate extends Vue {
    private logger = new Logger(CustomerCreate.name)
    customersStore = useCustomerStore()
    customerService = new CustomerService()
    // customerService = new CustomerService()

    errorMsg: string | null = null

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

            this.$router.push('/customers')
        }
    }
}
</script>
