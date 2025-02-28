<template>
    <h4>Delete account {{ id }}</h4>
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
        <RouterLink :to="{ name: 'accounts' }">Back to Accounts</RouterLink>
    </div>
</template>

<script lang="ts">
import { AccountService } from '@/bll/service/AccountService'
import { useAccountStore } from '@/stores/account'
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
        const logger = new Logger("AccountDelete")
        const id = props.id
        const accountsStore = useAccountStore()
        const accountService = new AccountService()

        let errorMsg: string | null = null

        return {
           logger,
           id,
           accountsStore,
           accountService,
           errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            await this.accountService.delete(this.id)

            /*
            if (res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                this.accountsStore.$state.accounts =
                    await this.accountService.getAll()

                this.$router.push('/accounts')
            }
             */
        }
    }
})
</script>
