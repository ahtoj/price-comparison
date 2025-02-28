import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import type { IShop } from '@/dal/domain/IShop'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export interface IShopRepository {
    findByName (entity: IShop): Promise<IServiceResult<IShop[]>>
}
