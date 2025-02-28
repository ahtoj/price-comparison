import type { IProduct } from '@/dal/domain/IProduct'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import { ProductRepository } from '@/dal/repository/ProductRepository'
import type { IProductService } from '@/bll/service/model/IProductService'
import type { IProductImport } from '@/dal/domain/IProductImport'
import { OfferRepository } from '@/dal/repository/OfferRepository'

/**
 * @author Ahto Jalak
 * @since 16.03.2023
 */
export class ProductService implements IProductService {
    private productRepository = new ProductRepository()
    private offerRepository = new OfferRepository()

    async findByName (searchName: string): Promise<IServiceResult<IProduct[]>> {
        return this.productRepository.findByName({
            name: searchName
        })
    }

    async add (productInfo: IProduct): Promise<IServiceResult<IProduct>> {
        return this.productRepository.add(productInfo)
    }

    async getAll (): Promise<IServiceResult<IProduct[]>> {
        return this.productRepository.getAll()
    }

    async import (entity: IProductImport): Promise<IServiceResult<IProduct[]>> {
        return this.productRepository.import(entity)
    }

    async getById (productId: number): Promise<IServiceResult<IProduct>> {
        return this.productRepository.get(productId)
    }

    async getOfferListById (id: number) {
        return this.offerRepository.getOfferListById(id)
    }

    async findByCategoryId (categoryId: number) {
        const entity: IProduct = {
            categoryId
        }
        return this.productRepository.findByName(entity)
    }
}
