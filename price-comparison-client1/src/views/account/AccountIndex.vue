<template>
    <h2>List of accounts</h2>
    <p>
        <RouterLink :to="{ name: 'accounts-create' }">Create new</RouterLink>
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
        <tr v-for="item of accountsStore.accounts" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.customerId }}</td>
            <td>
                <RouterLink :to="{ name: 'accounts-details', params: { id: item.id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'accounts-edit', params: { id: item.id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'accounts-delete', params: { id: item.id } }">Delete</RouterLink>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { AccountService } from '@/bll/service/AccountService'
import { useAccountStore } from '@/stores/account'
import Logger from '@/util/logger'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {},
    emits: [],
    setup() {
        const logger = new Logger("AccountIndex")
        const accountsStore = useAccountStore()
        const accountService = new AccountService()

        onMounted(() => {
            logger.info('mounted')
        })

        return {
            logger,
            accountsStore,
            accountService,
        }
    }
})

</script>
