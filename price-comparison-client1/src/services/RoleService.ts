import httpCLient from '@/http-client'
import { BaseService } from './BaseService'
import { AxiosError } from 'axios'
import { IRole } from '@/domain/IRole'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export class RoleService extends BaseService<IRole> {
    constructor () {
        super('v1/role')
    }

    async addMerchandiseRating () {
        this.logger.info('add')

        const entity: IRole = {}

        let response
        try {
            response = await httpCLient.post(`/${this._path}`, entity,
                { headers: { Authorization: 'bearer ' + this.identityStore.$state.jwt?.token } }
            )
        } catch (e) {
            const res = {
                status: (e as AxiosError).response?.status,
                errorMsg: (e as AxiosError).response?.data.error,
            }

            return res
        }

        return { status: response.status }
    }
}
