<template>
    <h2>Details account {{ id }}</h2>
    <div class="row">
        <div class="col-md-12">
            <div>
                <RouterLink :to="{ name: 'accounts-details', params: { id: id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'accounts-edit', params: { id: id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'accounts-delete', params: { id: id } }">Delete</RouterLink>
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
        id: String
    },
    emits: [],
    setup(props: any) {
        const logger = new Logger("AccountDetails")
        const id = props.id
        const accountsStore = useAccountStore()
        const accountService = new AccountService()

        return {
            logger,
            id,
            accountsStore,
            accountService,
        }
    },
})

</script>
