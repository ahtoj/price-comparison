<template>
    <div>Hwee {{ hello }} {{ name }}</div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
    components: {},
    props: {
        name: String, // string interface
    },
    setup(props) {
        const hello = 'Greetings, ' + props.name;

        return {
            hello,
        }
    }
})
</script>

<style scoped>

</style>
