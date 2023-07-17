<template>
    <div class="container-fluid h-100 row">
        <main class="h-100 col-xl-4 col-lg-5 col-md-6 col-sm-7 bg-white">
            <locale-changer/>
            <router-view/>
        </main>
    </div>
    <div>{{ token }}</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import router from '@/router/index'
import { useIdentityStore } from '@/stores/identity'
import Logger from '@/util/logger'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import LocaleChanger from '@/components/LocaleChanger.vue'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Options({
    components: {
        LocaleChanger
    },
})
export default class App extends Vue {
    private logger = new Logger(App.name)
    private identityStore = useIdentityStore()
    token = ''

    get isAuthenticated (): boolean {
        return this.identityStore.getJwt() !== null
    }

    logoutClicked (): void {
        this.identityStore.clearJwt()
        router.push('/')
    }

    refreshTokenClicked (): void {
        this.identityStore.refreshUser().then(async value => {
            if (value) {
                this.logger.info('token refresh')
            }
        })
        router.push('/')
    }

    mounted() {
        const firebaseConfig = {
            apiKey: "AIzaSyCWPyQ_47Nqn7hsLsNzlR21C6lbB7yr3RQ",
            authDomain: "price-comparison-vue.firebaseapp.com",
            projectId: "price-comparison-vue",
            storageBucket: "price-comparison-vue.appspot.com",
            messagingSenderId: "431621825092",
            appId: "1:431621825092:web:336da9fb3f431fe0a61211",
            measurementId: "G-B9GLLY4ZV6"
        };

        const app = initializeApp(firebaseConfig);
        this.logger.info(app.name)

        const messaging = getMessaging();
        getToken(messaging, { vapidKey: 'BBAFnqen9fnu1BttZ5RGr7FcIvwrVvJGe-lUwwyJPUbsKwP44AFcm9rVUqJArYxCskU9dBHw2zq0X5PRj6rYF00' }).then((currentToken) => {
            if (currentToken) {
                console.log("token success", currentToken)
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                // ...
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            // ...
        });
    }
}
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
