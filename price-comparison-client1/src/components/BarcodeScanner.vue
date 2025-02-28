<template>
    <div id="qr-code-full-region"></div>
</template>

<script>
import { Html5QrcodeScanner } from 'html5-qrcode'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 15.04.2023
 */
export default defineComponent({
    components: {},
    methods: {
        onScanSuccess (decodedText, decodedResult) {
            this.$emit('result', decodedText, decodedResult);
        }
    },
    props: {
        qrbox: {
            type: Number,
            default: 100
        },
        fps: {
            type: Number,
            default: 10
        },
    },
    setup() {
        onMounted(async () => {
            const config = {
                fps: this.fps,
                qrbox: this.qrbox,
            }
            const html5QrcodeScanner = new Html5QrcodeScanner('qr-code-full-region', config)
            html5QrcodeScanner.render(this.onScanSuccess)
        })

        return {
        }
    },
})
</script>

<style scoped>

</style>
