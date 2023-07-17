<template>
    <div class="locale-changer">
        <select v-model="$i18n.locale">
            <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang.code">
                {{ lang.text }}
            </option>
        </select>
    </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'

@Options({
    components: {},
})
export default class LocaleChanger extends Vue {
    data() {
        return {
            langs: [
                { code: 'en', text: 'English' },
                { code: 'et', text: 'Estonian' },
            ],
        }
    }
}
</script>

<style scoped>

</style>
