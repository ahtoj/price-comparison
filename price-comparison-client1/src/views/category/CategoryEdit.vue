<template>
    <h2>Edit category {{ id }}</h2>
    <div class="row">
        <div class="col-2">
            <RouterLink :to="{ name: 'categories' }">Back to Categories</RouterLink>
        </div>
        <div class="col-10">
            <div class="row">
                <div class="col-md-12">

                    <div v-if="errorMsg != null" class="text-danger validation-summary-errors"
                         data-valmsg-summary="true">
                        <ul>
                            <li>{{ errorMsg }}</li>
                        </ul>
                    </div>

                    <div>
                        <div class="form-group">
                            <label>Category name</label>
                            <input type="text" v-model="categoryName"/>
                        </div>
                        <div class="form-group">
                            <input @click="submitClicked()" type="submit" value="Create" class="btn btn-primary"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useCategoryStore } from '@/stores/category'
import { CategoryService } from '@/bll/service/CategoryService'
import Logger from '@/util/logger'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {
        id: String,
        name: String
    },
    emits: [],
    setup(props: any) {
        const logger = new Logger("CategoryCreate")
        const id = props.id
        const categoryName = props.name
        let errorMsg: string | null = null
        const categoriesStore = useCategoryStore()
        const categoryService = new CategoryService()

        onMounted(() => {
            logger.info('mounted')
            // const item = await this.categoryService.get(this.id)
            // this.categoryName = x.name ?? ''
            // this.categoriesStore.$state.category = x

        })

        return {
            logger,
            id,
            categoryName,
            categoriesStore,
            categoryService,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            // const x = await this.categoryService.get(this.id)
            // x.name = this.categoryName

            // const res = await this.categoryService.update(this.id, x)

            // if (res.status == null || res.status >= 300) {
            //     this.errorMsg = res.status + ' ' + res.errorMsg
            // } else {
            //     const item = await this.categoryService.get(this.id)
            //     this.categoriesStore.$state.category = item.data as ICategory
            //     this.$router.push(`/categories/details/${this.id}`)
            // }
        }
    }
})
</script>
