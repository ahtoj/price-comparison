import type { IProduct } from '@/dal/domain/IProduct'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export interface IAlarm {
    id?: number
    productId?: number
    alarmTypeCode?: string
    minValue?: number
    maxValue?: number
    name?: string
    product?: IProduct
}
