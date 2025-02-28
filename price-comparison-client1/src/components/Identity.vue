<template>
    <div>Hwee {{ hello }}</div>
    <ul>
        <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/identity/register">Register</router-link>
        </li>
        <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/identity/login">Login</router-link>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
            <a class="nav-link" @click="logoutClicked()">Logout</a>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
            <a class="nav-link" @click="refreshTokenClicked()">Refresh token</a>
        </li>
    </ul>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import router from "@/router";
import {useIdentityStore} from "@/stores/identity.ts";
import Logger from "@/util/logger.ts";

export default defineComponent({
    components: {},
    props: {
        name: String, // string interface
    },
    setup(props: any) {
        const hello = 'Greetings, ' + props.name;
        const identityStore = useIdentityStore()
        const logger = new Logger("Identity")

        return {
            hello,
            identityStore,
            logger,
        }
    },
    methods: {
        isAuthenticated (): boolean {
            return this.identityStore.getJwt() !== null
        },

        logoutClicked (): void {
            this.identityStore.clearJwt()
            router.push('/')
        },

        refreshTokenClicked (): void {
            this.identityStore.refreshUser().then(async value => {
                if (value) {
                    this.logger.info('token refresh')
                }
            })
            router.push('/')
        },
    },
})
</script>

<style scoped>

</style>
