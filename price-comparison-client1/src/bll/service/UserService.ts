import { BaseService } from './BaseService'
import type { IUser } from '@/dal/domain/IUser'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export class UserService extends BaseService<IUser> {
    constructor () {
        super('v1/user')
    }

    // async addMerchandiseRating (merchandiseId: string) {
    //     this.logger.info('add')
    //
    //     const entity: IUser = {}
    //
    //     let response
    //     try {
    //         response = await httpCLient.post(`/${this._path}`, entity,
    //             { headers: { Authorization: 'bearer ' + this.identityStore.$state.jwt?.token } }
    //         )
    //     } catch (e) {
    //         const res = {
    //             status: (e as AxiosError).response?.status,
    //             errorMsg: (e as AxiosError).response?.data.error,
    //         }
    //
    //         return res
    //     }
    //
    //     return { status: response.status }
    // }
}
