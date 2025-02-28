import type { IProduct } from '@/dal/domain/IProduct'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import type { IProductImport } from '@/dal/domain/IProductImport'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export interface IProductService {
    findByName (searchName: string): Promise<IServiceResult<IProduct[]>>

    add (productInfo: IProduct): Promise<IServiceResult<IProduct>>

    getAll (): Promise<IServiceResult<IProduct[]>>

    import (entity: IProductImport): Promise<IServiceResult<IProduct[]>>

    getById (productId: number): Promise<IServiceResult<IProduct>>
}
