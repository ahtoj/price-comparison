import type { IProduct } from '@/dal/domain/IProduct'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export interface IReview {
    id?: number
    productId?: number
    reviewTypeCode?: string
    score?: number
    description?: string
    product?: IProduct
}
