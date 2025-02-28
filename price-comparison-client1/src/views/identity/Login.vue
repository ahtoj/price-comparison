<script lang="ts">
import { useIdentityStore } from '@/stores/identity'
import type { ILoginInfo } from '@/dal/domain/ILoginInfo'
import router from '@/router'
import type { IResponseMessage } from '@/dal/domain/IResponseMessage'
import Logger from '@/util/logger'
import type { CredentialResponse } from "vue3-google-signin"
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {
    },
    data () {
        return {
            asd: 'asd',
        }
    },
    computed: {
    },
    props: {},
    emits: [],
    setup() {
        const logger = new Logger("Login")
        const identityStore = useIdentityStore()
        const loginWasOk: boolean | null = null
        const errorMsg: string | null = null
        const email = ''
        const password = ''

        return {
            logger,
            identityStore,
            loginWasOk,
            errorMsg,
            email,
            password,
        }
    },
    methods: {
        handleLoginSuccess (response: CredentialResponse): void {
            console.log("Access Token", response)
            if (response.credential) {
                const loginInfo: ILoginInfo = {
                    email: "",
                    password: "",
                    provider: "G",
                    credential: response.credential
                }
                this.identityStore.authenticateUser(loginInfo)
                    .then((response: IResponseMessage) => {
                        this.loginWasOk = response.errorMsg == null

                        if (this.loginWasOk) {
                            router.push('/')
                        } else {
                            if (response.errorMsg != null) {
                                this.errorMsg = response.errorMsg
                            }
                        }
                    })
            }
        },

        handleLoginError (errorResponse: any): void {
            if (errorResponse) {
                console.log("Error: ", errorResponse)
            }
        },

        loginClicked (): void {
            this.logger.info('submitClicked')
            const loginInfo: ILoginInfo = {
                    email: this.email,
                    password: this.password,
                    provider: "B",
                    credential: ""
                }
            this.identityStore.authenticateUser(loginInfo)
                .then((response: IResponseMessage) => {
                    this.loginWasOk = response.errorMsg == null

                    if (this.loginWasOk) {
                        router.push('/')
                    } else {
                        if (response.errorMsg != null) {
                            this.errorMsg = response.errorMsg
                        }
                    }
                })
        },
    },
})
</script>

<template>
    <RouterLink :to="{ name: 'home' }">
        <i class="bi bi-backspace"></i>
    </RouterLink>

    <h2>Logi sisse</h2>
    <div className="row">
        <div className="col-sm">
            <div v-if="errorMsg != null" className="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>
            <div class="form-group">
                <label className="control-label" htmlFor="firstname">e-mail</label>
                <input v-model="email" className="form-control" type="text"/>
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="lastname">parool</label>
                <input v-model="password" className="form-control" type="password"/>
            </div>
            <div class="row">
                <div class="col-6">
                    <button @click="loginClicked" class="btn btn-primary w-100">
                        Logi sisse
                    </button>
                </div>
                <div class="col-6">
                    <GoogleSignInButton
                        @success="handleLoginSuccess"
                        @error="handleLoginError"
                        class="w-100"
                    ></GoogleSignInButton>
                </div>
            </div>
        </div>
    </div>

</template>
