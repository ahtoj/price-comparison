<script lang="ts">
import { useIdentityStore } from '@/stores/identity'
import { Options, Vue } from 'vue-class-component'
import { ILoginInfo } from '@/dal/domain/ILoginInfo'
import router from '@/router'
import { IResponseMessage } from '@/dal/domain/IResponseMessage'
import Logger from '@/util/logger'
import { CredentialResponse } from "vue3-google-signin"

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Options({
    components: {
    },
    data () {
        return {
            asd: 'asd',
        }
    },
    computed: {
    },
    methods: {
    },
    props: {},
    emits: [],
})
export default class Login extends Vue {
    private logger = new Logger(Login.name)
    private identityStore = useIdentityStore()
    private loginWasOk: boolean | null = null
    errorMsg: string | null = null
    email = ''
    password = ''

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
    }

    handleLoginError (errorResponse: any): void {
        if (errorResponse) {
            console.log("Error: ", errorResponse)
        }
    }

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
    }

    // ============ Lifecycle methods ==========
    beforeCreate (): void {
        this.logger.info('beforeCreate')
    }

    created (): void {
        this.logger.info('created')
    }

    beforeMount (): void {
        this.logger.info('beforeMount')
    }

    mounted (): void {
        this.logger.info('mounted')
    }

    beforeUpdate (): void {
        this.logger.info('beforeUpdate')
    }

    updated (): void {
        this.logger.info('updated')
    }

    beforeDestroy (): void {
        this.logger.info('beforeDestroy')
    }

    destroyed (): void {
        this.logger.info('destroyed')
    }
}
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
