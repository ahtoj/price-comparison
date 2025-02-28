import { defineStore } from 'pinia'
import type { IJwtResponse } from '@/dal/domain/IJwtResponse'
import type { ILoginInfo } from '@/dal/domain/ILoginInfo'
import { IdentityService } from '@/bll/service/IdentityService'
import type { IResponseMessage } from '@/dal/domain/IResponseMessage'
import type { IRegisterInfo } from '@/dal/domain/IRegisterInfo'
import type { ICurrentLocation } from '@/dal/domain/ICurrentLocation'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useIdentityStore = defineStore('identity', {
    state: () => ({
        jwt: null as IJwtResponse | null,
        currentLocation: {} as ICurrentLocation,
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
        getCoords (): ICurrentLocation {
            return this.currentLocation
        },
        setUserRole (): void {

        }
    },
})
