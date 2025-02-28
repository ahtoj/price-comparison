import type { ICategory } from '@/dal/domain/ICategory'
import type { ICategoryService } from '@/bll/service/model/ICategoryService'
import { CategoryRepository } from '@/dal/repository/CategoryRepository'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export class CategoryService implements ICategoryService {
    private categoryRepository = new CategoryRepository()

    async getAllByCategoryId (categoryId: number | null): Promise<IServiceResult<ICategory[]>> {
        return this.categoryRepository.findByName({
            parentCategoryId: categoryId ?? 0
        })
    }

    async findByName (searchName: string): Promise<IServiceResult<ICategory[]>> {
        return this.categoryRepository.findByName({
            name: searchName
        })
    }

    async add (category: ICategory) {
        return this.categoryRepository.add(category)
    }

    async getAll (): Promise<IServiceResult<ICategory[]>> {
        return this.categoryRepository.getAll()
    }
}
