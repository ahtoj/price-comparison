import type { IServiceResult } from '@/bll/service/model/IServiceResult'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export interface IBaseRepository<TEntity> {
    getAll (): Promise<IServiceResult<TEntity[]>>

    get (id: number): Promise<IServiceResult<TEntity>>

    add (entity: TEntity): Promise<IServiceResult<TEntity>>

    update (id: number, entity: TEntity): Promise<IServiceResult<TEntity>>

    delete (id: number): Promise<IServiceResult<number>>
}
