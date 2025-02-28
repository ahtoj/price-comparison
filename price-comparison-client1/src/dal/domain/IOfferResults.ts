import type { IShop } from '@/dal/domain/IShop'
import type { IOffer } from '@/dal/domain/IOffer'

/**
 * @author Ahto Jalak
 * @since 30.04.2023
 */
export interface IOfferResults {
    id?: number
    name?: string
    shop?: IShop
    url?: string
    latitude?: number
    longitude?: number
    minPrice?: number
    offers?: IOffer[]
}
