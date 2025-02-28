<template>
    <h4>Create wish</h4>
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
        <RouterLink :to="{ name: 'wishes' }">Back to Rolees</RouterLink>
    </div>
</template>

<script lang="ts">
import { CustomerService } from '@/bll/service/CustomerService'
import { RoleService } from '@/bll/service/RoleService'
import { useRoleStore } from '@/stores/role'
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
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            const res = await this.wishService.add(
                {}
            )

            this.logger.info(res.status)

            await router.push('/wishes')
        }
    },
    setup() {
        const wishesStore = useRoleStore()
        const wishService = new RoleService()
        const customerService = new CustomerService()
        const logger = new Logger("RoleCreate")

        return {
            wishesStore,
            wishService,
            customerService,
            logger,
        }
    }
})
</script>
