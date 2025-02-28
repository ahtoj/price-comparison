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
        <RouterLink :to="{ name: 'wishes' }">Back to Rolees</RouterLink>
    </div>
</template>

<script lang="ts">
import { RoleService } from '@/bll/service/RoleService'
import { useRoleStore } from '@/stores/role'
import Logger from '@/util/logger'
import type { IWatchlist } from '@/dal/domain/IWatchlist'
import {defineComponent, onMounted} from "vue";

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
    setup(props : any) {
        const id = props.id
        const logger = new Logger("RoleDetails")

        const wishesStore = useRoleStore()
        const wishService = new RoleService()

        onMounted(async() => {
            logger.info('mounted')
            const item = await wishService.get(id)
            wishesStore.$state.role = item.data as IWatchlist
        })

        return {
            logger,
            id,
            wishesStore,
            wishService,
        }
    },

})

</script>
