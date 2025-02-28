<template>
    <h4>Create account</h4>
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
        <RouterLink :to="{ name: 'accounts' }">Back to Accounts</RouterLink>
    </div>
</template>

<script lang="ts">
import { AccountService } from '@/bll/service/AccountService'
import { useAccountStore } from '@/stores/account'
import { CustomerService } from '@/bll/service/CustomerService'
import Logger from '@/util/logger'
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {},
    emits: [],
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')
        },
    },
    setup() {
        const logger = new Logger("AccountCreate")
        const accountsStore = useAccountStore()
        const accountService = new AccountService()
        const customerService = new CustomerService()
        const errorMsg: string | null = null

        return {
            logger,
            accountsStore,
            accountService,
            customerService,
            errorMsg,
        }
    }
})
</script>
