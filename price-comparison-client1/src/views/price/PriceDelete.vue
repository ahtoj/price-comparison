<template>
    <h4>Delete wish {{ id }}</h4>
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
        <RouterLink :to="{ name: 'wishes' }">Back to Prices</RouterLink>
    </div>
</template>

<script lang="ts">
import { PriceService } from '@/bll/service/PriceService'
import { usePriceStore } from '@/stores/price'
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
    setup() {
        const logger = new Logger("PriceDelete")
        const id = props.id
        const wishesStore = usePriceStore()
        const wishService = new PriceService()

        const errorMsg: string | null = null

        return {
            logger,
            id,
            wishesStore,
            wishService,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            // const res = await this.wishService.delete(this.id);

            /*
            if (res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                this.wishesStore.$state.wishes =
                    await this.wishService.getAll()

                this.$router.push('/wishes')
            }
             */
        }
    }
})
</script>
