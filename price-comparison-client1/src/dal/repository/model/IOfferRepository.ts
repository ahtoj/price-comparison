import type { IOffer } from '@/dal/domain/IOffer'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export interface IOfferRepository {
    getOfferListById (productId: number): Promise<IServiceResult<IOffer[]>>
}
