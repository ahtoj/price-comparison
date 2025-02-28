import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import type { ICategory } from '@/dal/domain/ICategory'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export interface ICategoryRepository {
    findByName (entity: ICategory): Promise<IServiceResult<ICategory[]>>
}
