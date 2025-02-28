import type { IUser } from '@/dal/domain/IUser'
import { defineStore } from 'pinia'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useUserStore = defineStore('users', {
    state: () => ({
        user: {} as IUser,
        users: [] as IUser[],
    }),
    getters: {
        userCount: (state) => state.users.length,
    },
    actions: {
        add (user: IUser) {
            this.users.push(user)
        }
    },
})
