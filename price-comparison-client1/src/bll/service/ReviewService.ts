import { BaseService } from './BaseService'
import type { IReview } from '@/dal/domain/IReview'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export class ReviewService extends BaseService<IReview> {
    constructor () {
        super('v1/review')
    }
}
