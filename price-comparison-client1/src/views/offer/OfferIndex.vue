<template>
    <div class="row">
        <div class="col-2 border p-4">
            <p>
                <RouterLink :to="{ name: 'merchandises-create' }">Upload CSV file</RouterLink>
            </p>
            <p>
                What now?
            </p>
            <p>
                Merchant steps:
            </p>
            <ul class="list-group-numbered px-0">
                <li>Signup and login</li>
                <li>Add your product</li>
                <li>Compete offers</li>
            </ul>
            <p>
                Consumer steps:
            </p>
            <ul class="list-group-numbered px-0">
                <li>Signup and login</li>
                <li>Search and filter</li>
                <li>Compare offers</li>
            </ul>
        </div>
        <div class="col-10 p-4">
            <h2>Your stock</h2>
            <div v-for="item of limitArray(5)" :key="item.id" class="border p-2 mb-4">
                <h3>{{ item.name }}</h3>
                <div>{{ item.barcode }}</div>
                <small v-if="isAdmin()">
                    <RouterLink :to="{ name: 'merchandises-details', params: { id: item.id } }">Details</RouterLink>
                    |
                    <RouterLink :to="{ name: 'merchandises-edit', params: { id: item.id } }">Edit</RouterLink>
                    |
                    <RouterLink :to="{ name: 'merchandises-delete', params: { id: item.id } }">Delete</RouterLink>
                </small>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { OfferService } from '@/bll/service/OfferService'
import { useIdentityStore } from '@/stores/identity'
import { useOfferStore } from '@/stores/offer'
import Logger from '@/util/logger'
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    setup() {
        const logger = new Logger("OfferIndex")
        const merchandisesStore = useOfferStore()
        const merchandiseService = new OfferService()
        const identityStore = useIdentityStore()

        return {
            logger,
            merchandisesStore,
            merchandiseService,
            identityStore,
        }
    },
    methods: {
        isAuthenticated (): boolean {
            return this.identityStore.getJwt() !== null
        },

        isAdmin (): boolean {
            return this.identityStore.isAdmin()
        },

        limitArray (limit: number) {
            this.logger.info('limitArray: ' + limit)
            return this.merchandisesStore.$state.offers
        },

        async mounted (): Promise<void> {
            this.logger.info('mounted')
            // this.merchandisesStore.$state.offers =
            //     await this.merchandiseService.getAll()
        }
    }
})
</script>
