<template>
    <div class="container-fluid h-100 row">
        <main class="h-100 col-12 bg-white">
            <router-view/>
        </main>
    </div>
    <div>{{ token }}</div>
</template>

<script lang="ts">
import { useIdentityStore } from '@/stores/identity'
import Logger from '@/util/logger'
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent( {
    components: {
    },
    setup() {
        const logger = new Logger("App")
        const identityStore = useIdentityStore()
        const token = ''

        return {
            logger,
            identityStore,
            token,
        }
    },
    methods: {
    },
})

</script>

<style>
@import './assets/base.css';

html, body {
    height: 100%;
}

#app {
    background-color: whitesmoke;
    height: 100%;
}
.main-border {
    border: 1px solid silver;
}
</style>
