<template>
    <h2>List of wishes</h2>
    <p>
        <RouterLink :to="{ name: 'wishes-create' }">Create new</RouterLink>
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
        <tr v-for="item of wishService.getAll()" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.customerId }}</td>
            <td>
                <RouterLink :to="{ name: 'wishes-details', params: { id: item.id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'wishes-edit', params: { id: item.id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'wishes-delete', params: { id: item.id } }">Delete</RouterLink>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { RoleService } from '@/bll/service/RoleService'
import { useRoleStore } from '@/stores/role'
import Logger from '@/util/logger'
import type { IRole } from '@/dal/domain/IRole'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    setup() {
        const logger = new Logger("RoleIndex")
        const wishesStore = useRoleStore()
        const wishService = new RoleService()

        onMounted(async () => {
            logger.info('mounted')
            const items = await wishService.getAll()
            wishesStore.$state.roles = items.data as IRole[]
        })

        return {
            logger,
            wishesStore,
            wishService,
        }
    },
})

</script>
