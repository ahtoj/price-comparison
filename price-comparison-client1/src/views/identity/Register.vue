<script lang="ts">
import { useIdentityStore } from '@/stores/identity'
import { Options, Vue } from 'vue-class-component'
import router from '@/router'
import { IResponseMessage } from '@/dal/domain/IResponseMessage'
import { IRegisterInfo } from '@/dal/domain/IRegisterInfo'
import Logger from '@/util/logger'
import { CredentialResponse } from "vue3-google-signin"

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Options({
    components: {},
    methods: {
    },
    props: {},
    emits: [],
})
export default class Register extends Vue {
    private logger = new Logger(Register.name)
    private identityStore = useIdentityStore()
    private loginWasOk: boolean | null = null
    errorMsg: string | null = null
    invitation = ''
    email = ''
    firstname = ''
    lastname = ''
    password = ''
    passwordRepeat = ''
    consent = false

    handleLoginSuccess (response: CredentialResponse): void {
        console.log("Access Token", response)

        if (response.credential) {
            const registerInfo: IRegisterInfo = {
                invitation: "",
                email: "",
                password: "",
                firstname: "",
                lastname: "",
                consent: true,
                provider: "G",
                credential: response.credential,
            }
            this.identityStore.registerUser(registerInfo)
                .then((response: IResponseMessage) => {
                    this.loginWasOk = response.data !== undefined
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

    handleLoginError (): void {
        console.log("Login failed")
    }

    async registerClicked (): Promise<void> {
        this.logger.info('submitClicked')
        const registerInfo: IRegisterInfo = {
            invitation: this.invitation,
            email: this.email,
            firstname: this.firstname,
            lastname: this.lastname,
            password: this.password,
            consent: this.consent,
            provider: "B",
            credential: ""
        }
        this.identityStore.registerUser(registerInfo)
            .then((response: IResponseMessage) => {
                this.loginWasOk = response.data !== undefined
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
</script>

<template>
    <RouterLink :to="{ name: 'home' }">
        <i class="bi bi-backspace"></i>
    </RouterLink>

    <h2>Registreeri</h2>
    <div className="row">
        <div className="col-md-12">

            <div v-if="errorMsg != null" className="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div className="form-group">
                <label className="control-label" htmlFor="email">E-mail</label>
                <input v-model="email" className="form-control" type="text"/>
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="firstname">Eesnimi</label>
                <input v-model="firstname" className="form-control" type="text"/>
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="lastname">Perenimi</label>
                <input v-model="lastname" className="form-control" type="text"/>
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="password">Parool</label>
                <input v-model="password" className="form-control" type="password"/>
            </div>
            <div className="form-group">
                <label className="control-label" htmlFor="passwordRepeat">Parool 2x</label>
                <input v-model="passwordRepeat" className="form-control" type="password"/>
            </div>
            <div className="form-group">
                <div class="form-check form-switch">
                    <input v-model="consent" class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Nõustun tingimustega</label>
                </div>
            </div>
            <div class="row">
                <div className="col-6">
                    <button @click="registerClicked()" class="btn btn-primary w-100">
                        Registreeri
                    </button>
                </div>
                <div class="col-6">
                     <GoogleSignInButton
                        @success="handleLoginSuccess"
                        @error="handleLoginError"
                        text="continue_with"
                    ></GoogleSignInButton>
                </div>
            </div>
        </div>
    </div>

</template>
