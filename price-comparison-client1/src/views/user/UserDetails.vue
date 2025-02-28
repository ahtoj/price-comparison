<template>
    <h2>Details wish {{ id }}</h2>
    <div class="row">
        <div class="col-md-12">
            <div>
                <RouterLink :to="{ name: 'wishes-details', params: { id: id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'wishes-edit', params: { id: id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'wishes-delete', params: { id: id } }">Delete</RouterLink>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'wishes' }">Back to Useres</RouterLink>
    </div>
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
@Options({
    components: {},
    props: {
        id: Number,
    },
    emits: [],
})
export default defineComponent({
    setup() {
        onMounted(() => {

        })

        return {

        }
    },
    private logger = new Logger(UserDetails.name)
    id!: number
    userStore = useUserStore()
    userService = new UserService()

    async mounted (): Promise<void> {
        this.logger.info('mounted')
        const item = await this.userService.get(this.id)
        this.userStore.$state.user = item.data as IUser
    }
}

</script>
