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
        <tr v-for="item of wishes" :key="item.id">
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
import { UserService } from '@/bll/service/UserService'
import { useUserStore } from '@/stores/user'
import Logger from '@/util/logger'
import type { IUser } from '@/dal/domain/IUser'
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    setup() {
        onMounted(() => {

        })

        return {

        }
    },
    private logger = new Logger(UserIndex.name)
    userStore = useUserStore()
    userService = new UserService()

    async mounted (): Promise<void> {
        this.logger.info('mounted')
        const items = await this.userService.getAll()
        this.userStore.$state.users = items.data as IUser[]
    }
}

</script>
