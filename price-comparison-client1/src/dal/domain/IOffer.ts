import type { IShop } from '@/dal/domain/IShop'
import type { IPrice } from '@/dal/domain/IPrice'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export interface IOffer {
    id?: number
    productId?: number
    shopId?: number
    shop?: IShop
    barcode?: string
    name?: string
    description?: string
    url?: string
    price?: IPrice
    minPrice?: number
    addedBy?: string
    productImage?: string
    categoryId?: number
}
