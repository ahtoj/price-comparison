<template>
    <RouterLink :to="{ name: 'home' }">
        <img src="https://via.placeholder.com/40x40.png?text=back" alt="back"/>
    </RouterLink>

    <h2>Register</h2>
    <div className="row">
        <div className="col-md-12">

            <div v-if="errorMsg != null" className="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div>
                <div className="form-group">
                    <label className="control-label" htmlFor="invitation">Invitation code</label>
                    <input v-model="invitation" className="form-control" type="text"/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="email">E-mail</label>
                    <input v-model="email" className="form-control" type="text"/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="firstname">First name</label>
                    <input v-model="firstname" className="form-control" type="text"/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="lastname">Last name</label>
                    <input v-model="lastname" className="form-control" type="text"/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="password">Password</label>
                    <input v-model="password" className="form-control" type="password"/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="passwordRepeat">Password repeat</label>
                    <input v-model="passwordRepeat" className="form-control" type="password"/>
                </div>
                <div className="form-group">
                    <div class="form-check form-switch">
                        <input v-model="consent" class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                        <label class="form-check-label" for="flexSwitchCheckDefault">I agree with terms and
                            conditions</label>
                    </div>
                </div>
                <div className="form-group">
                    <button @click="registerClicked()" class="btn btn-primary">
                        Register
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import { useIdentityStore } from '@/stores/identity'
import { Options, Vue } from 'vue-class-component'
import { IRegisterInfo } from '@/domain/ILoginInfo'
import router from '@/router'
import { IResponseMessage } from '@/domain/IResponseMessage'

@Options({
    components: {},
    props: {},
    emits: [],
})
export default class Register extends Vue {
    private identityStore = useIdentityStore()
    private loginWasOk: boolean | null = null
    private errorMsg: string | null = null
    private invitation = ''
    private email = ''
    private firstname = ''
    private lastname = ''
    private password = ''
    private passwordRepeat = ''
    private consent = false

    async registerClicked (): Promise<void> {
        console.log('submitClicked')
        const registerInfo: IRegisterInfo = {
            invitation: this.invitation,
            email: this.email,
            firstname: this.firstname,
            lastname: this.lastname,
            password: this.password,
            consent: this.consent,
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