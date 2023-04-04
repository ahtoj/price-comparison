import { defineStore } from 'pinia'
import { IJwtResponse } from '@/domain/IJwtResponse'
import { ILoginInfo } from '@/domain/ILoginInfo'
import { IdentityService } from '@/services/IdentityService'
import { IResponseMessage } from '@/domain/IResponseMessage'
import { IRegisterInfo } from '@/domain/IRegisterInfo'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useIdentityStore = defineStore({
    id: 'identity',
    state: () => ({
        jwt: null as IJwtResponse | null
    }),
    getters: {},
    actions: {
        getJwt (): IJwtResponse | null {
            return this.jwt
        },
        setJwt (jwtStr: IJwtResponse | null) {
            this.jwt = jwtStr
        },
        isUser (): boolean {
            if (this.jwt !== null) {
                return this.jwt.roles.split(',').indexOf('user') > -1
            }
            return false
        },
        isAdmin (): boolean {
            if (this.jwt !== null) {
                return this.jwt.roles.split(',').indexOf('admin') > -1
            }
            return false
        },
        async authenticateUser (loginInfo: ILoginInfo): Promise<IResponseMessage> {
            const identityService = new IdentityService()
            const serviceResult = await identityService.login(loginInfo)
            if (serviceResult.status === 200 && serviceResult.data != null) {
                this.setJwt(serviceResult.data)
                return {
                    data: serviceResult.data,
                }
            }
            return {
                errorMsg: serviceResult.errorMsg,
            }
        },
        async registerUser (registerDTO: IRegisterInfo): Promise<IResponseMessage> {
            const identityService = new IdentityService()
            const jwt = await identityService.register(registerDTO)
            if (jwt.status === 200 && jwt.data != null) {
                this.setJwt(jwt.data)
                return {
                    data: jwt.data
                }
            }
            return {
                errorMsg: jwt.errorMsg
            }
        },
        async refreshUser (): Promise<boolean> {
            const identityService = new IdentityService()
            const res = await identityService.refreshIdentity()
            if (res.status === 200 && res.data != null) {
                this.setJwt(res.data)
                return true
            }
            return false
        },
        clearJwt (): void {
            this.setJwt(null)
        },
    },
})
