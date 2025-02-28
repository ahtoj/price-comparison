<template>
    <div class="row">
        <div class="col-lg-10">
            <h2>Main category items</h2>
            <div v-for="item of categories" :key="item.id" class="border p-2 mb-4 row">
                <div class="col-3">
                    <img src="https://via.placeholder.com/200x50.png?text=category" alt="category"/>
                </div>
                <div class="col-6">
                    <h3>
                        <RouterLink :to="{ name: 'categories-details', params: { id: item.id } }" class="text-dark">
                            {{ item.name }}
                        </RouterLink>
                    </h3>
                </div>
                <div v-if="identityStore.isAdmin()" class="col-3 small">
                    <RouterLink :to="{ name: 'categories-details', params: { id: item.id } }">Details</RouterLink>
                    |
                    <RouterLink :to="{ name: 'categories-edit', params: { id: item.id } }">Edit</RouterLink>
                    |
                    <RouterLink :to="{ name: 'categories-delete', params: { id: item.id } }">Delete</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { CategoryService } from '@/bll/service/CategoryService'
import { useCategoryStore } from '@/stores/category'
import Logger from '@/util/logger'
import {defineComponent, onMounted} from "vue";
import {useIdentityStore} from "@/stores/identity.ts";
import type {ICategory} from "@/dal/domain/ICategory.ts";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    setup() {
        const logger = new Logger("CategoryIndex")
        const categoryStore = useCategoryStore()
        const categoryService = new CategoryService()
        const identityStore = useIdentityStore()
        let errorMsg: string | null = null
        let categories = {} as ICategory[]

        onMounted(() => {
            categoryService.getAllByCategoryId(null).then((items) => {
                if (items.errorMsg !== undefined) {
                    errorMsg = items.errorMsg
                } else {
                    if (items.data) {
                        categories = items.data
                    }
                }
            })
        })

        return {
            logger,
            categoryStore,
            categoryService,
            errorMsg,
            identityStore,
            categories,
        }
    }
})
</script>
