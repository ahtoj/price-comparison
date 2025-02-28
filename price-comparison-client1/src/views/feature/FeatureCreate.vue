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
        <RouterLink :to="{ name: 'wishes' }">Back to Featurees</RouterLink>
    </div>
</template>

<script lang="ts">
import { CustomerService } from '@/bll/service/CustomerService'
import { useFeatureStore } from '@/stores/feature'
import { FeatureService } from '@/bll/service/FeatureService'
import Logger from '@/util/logger'
import router from "@/router";
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    setup() {
        const logger = new Logger("FeatureCreate")
        const wishesStore = useFeatureStore()
        const wishService = new FeatureService()
        const customerService = new CustomerService()

        let errorMsg: string | null = null

        return {
            logger,
            wishesStore,
            wishService,
            customerService,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            const res = await this.wishService.add(
                {}
            )

            if (res.status == null || res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                // this.wishesStore.$state.wishes =
                //     await this.wishService.getAll()

                await router.push('/wishes')
            }
        }
    }
})
</script>
