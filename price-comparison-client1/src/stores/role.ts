import type { IRole } from '@/dal/domain/IRole'
import { defineStore } from 'pinia'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useRoleStore = defineStore('roles', {
    state: () => ({
        role: {} as IRole,
        roles: [] as IRole[],
    }),
    getters: {
        roleCount: (state) => state.roles.length,
    },
    actions: {
        add (role: IRole) {
            this.roles.push(role)
        }
    },
})
