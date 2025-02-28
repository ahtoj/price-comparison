import type { IJwtResponse } from '@/dal/domain/IJwtResponse'

export interface IResponseMessage {
    data?: IJwtResponse
    errorMsg?: string
}
