import type { ICategory } from '@/dal/domain/ICategory'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export interface ICategoryService {
    getAllByCategoryId (categoryId: number | null): Promise<IServiceResult<ICategory[]>>

    findByName (searchName: string): Promise<IServiceResult<ICategory[]>>

    add (category: ICategory): Promise<IServiceResult<ICategory>>

    getAll (): Promise<IServiceResult<ICategory[]>>
}
