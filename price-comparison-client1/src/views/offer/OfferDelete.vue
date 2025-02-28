<template>
    <h4>Delete merchandise {{ id }}</h4>
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
        <RouterLink :to="{ name: 'merchandises' }">Back to Offers</RouterLink>
    </div>
</template>

<script lang="ts">
import { OfferService } from '@/bll/service/OfferService'
import { useOfferStore } from '@/stores/offer'
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
    setup(props) {
        const logger = new Logger("OfferDelete")
        const id = props.id
        const merchandisesStore = useOfferStore()
        const merchandiseService = new OfferService()

        const errorMsg: string | null = null

        return {
            logger,
            id,
            merchandisesStore,
            merchandiseService,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            await this.merchandiseService.delete(this.id)

            /*
            if (res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                this.merchandisesStore.$state.merchandises =
                    await this.merchandiseService.getAll()

                this.$router.push('/merchandises')
            }
             */
        }
    }
})
</script>
