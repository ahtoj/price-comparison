import type { IJwtResponse } from '@/dal/domain/IJwtResponse'
import httpCLient from '@/util/http-client'
import { useIdentityStore } from '@/stores/identity'
import type { AxiosError } from 'axios'
import type { IServiceResult } from './model/IServiceResult'
import type { ILoginInfo } from '@/dal/domain/ILoginInfo'
import type { IRegisterInfo } from '@/dal/domain/IRegisterInfo'
import Logger from '@/util/logger'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export class IdentityService {
    private logger = new Logger(IdentityService.name)

    private identityStore = useIdentityStore()

    async login (loginInfo: ILoginInfo): Promise<IServiceResult<IJwtResponse>> {
        try {
            const response = await httpCLient.post('/v1/auth/login', loginInfo)
            return {
                status: response.status,
                data: response.data as IJwtResponse
            }
        } catch (e) {
            if ((e as AxiosError).response) {
                return {
                    status: (e as AxiosError).response?.status,
                    errorMsg: (e as AxiosError).response?.statusText,
                }
            } else {
                this.logger.info((e as AxiosError).message)
                return {
                    status: 400,
                    errorMsg: 'unknown: ' + (e as AxiosError).message,
                }
            }
        }
    }

    async refreshIdentity (): Promise<IServiceResult<IJwtResponse>> {
        try {
            const response = await httpCLient.post('/v1/auth/refresh', {
                token: this.identityStore.$state.jwt?.token,
                refreshToken: this.identityStore.$state.jwt?.refreshToken
            })
            return {
                status: response.status,
                data: response.data as IJwtResponse,
            }
        } catch (e) {
            const err = e as AxiosError
            return {
                status: err.response?.status,
                errorMsg: err.response?.statusText,
            }
        }
    }

    async register (registerInfo: IRegisterInfo): Promise<IServiceResult<IJwtResponse>> {
        try {
            const response = await httpCLient.post('/v1/auth/register', registerInfo)
            return {
                status: response.status,
                data: response.data as IJwtResponse,
            }
        } catch (e) {
            const err = e as AxiosError
            return {
                status: err.response?.status,
                errorMsg: err.response?.statusText,
            }
        }
    }

    async logout () {
        this.identityStore.clearJwt()
    }

    isAuthenticated () {
        return this.identityStore.getJwt() !== null
    }
}
