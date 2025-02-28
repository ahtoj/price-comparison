<template>
    <h4>Create category</h4>
    <div class="row">
        <div class="col-md-12">

            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div>
                <select v-model="categoryParentCategoryId">
                    <option v-for="asd in categories"
                            v-bind:key="asd.id" v-bind:value="asd.id">
                        {{ asd.name }}
                    </option>
                </select>
                <div class="form-group">
                    <label>Kategooria nimi</label>
                    <input type="text" v-model="categoryName"/>
                </div>
                <div class="form-group row p-3">
                    <div class="col-4 p-2 control-label">
                        <label>Kategooria pilt</label>
                    </div>
                    <div class="col-8 p-2">
                        <upload-image/>
                    </div>
                </div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Create" class="btn btn-primary"/>
                </div>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'categories' }">Back to Categories</RouterLink>
    </div>
</template>

<script lang="ts">
import { CategoryService } from '@/bll/service/CategoryService'
import { useCategoryStore } from '@/stores/category'
import type { ICategory } from '@/dal/domain/ICategory'
import router from '@/router'
import Logger from '@/util/logger'
import UploadImage from '@/components/UploadImage.vue'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {
        UploadImage,
    },
    props: {},
    emits: [],
    setup () {
        const logger = new Logger("CategoryCreate")
        const categoriesStore = useCategoryStore()
        const categoryService = new CategoryService()

        const categories: ICategory[] = []
        const categoryParentCategoryId: number | null = null
        const categoryName: string | null = null
        let errorMsg: string | null = null

        onMounted(()=> {
            logger.info('mounted')
            categories.push({
                id: 0,
                name: '--- no parent category ---'
            })
            categoryService.getAllByCategoryId(null).then((res) => {
                if (res.data) {
                    for (const item of res.data) {
                        categories.push(item)
                    }
                }
            })
        })

        return {
            logger,
            categoriesStore,
            categoryService,
            categories,
            categoryParentCategoryId,
            categoryName,
            errorMsg,
        }
    },
    methods: {
        submitClicked (): void {
            this.logger.info('submitClicked')
            const category = {parentCategoryId: this.categoryParentCategoryId, name: this.categoryName} as ICategory
            this.categoryService.add(category).then(res => {
                if (res.data == null) {
                    this.errorMsg = res.status + ' ' + res.errorMsg
                } else {
                    this.categoriesStore.$state.categories.push(res.data)
                    router.push('/category')
                }
            })
        }
    }
})
</script>
