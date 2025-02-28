import type { IProduct } from '@/dal/domain/IProduct'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export interface IWatchlist {
    id?: number
    customerId?: number
    productId?: number
    watchlistTypeCode?: string
    product?: IProduct
}
