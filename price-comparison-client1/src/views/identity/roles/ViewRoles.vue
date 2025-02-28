<template>
    <div class="row">
        <div class="col-2"></div>
        <div class="col-10">
            <ul>
                <li v-for="item of limitArray(5)" :key="item.id">
                    {{ email }} - {{ roles }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { useIdentityStore } from '@/stores/identity'
import Logger from '@/util/logger'
import {defineComponent} from "vue";

export default defineComponent({
    setup() {
        const logger = new Logger("EditRoles")
        const identityStore = useIdentityStore()
        const wasOk: boolean | null = null

        const email = ''
        const password = ''
        let errorMsg: string | null = null

        return {
            logger,
            identityStore,
            email,
            password,
            wasOk,
            errorMsg,
        }
    },
})
</script>

<style scoped>

</style>
