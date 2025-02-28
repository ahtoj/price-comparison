<template>
    <div>
        <div class="row border-1" v-if="!isCameraOpen && !pictureTaken">
            <div class="col-12">
                <label class="btn btn-default p-0">
                    <input
                        type="file"
                        accept="image/*"
                        ref="file"
                        @change="selectImage"
                    />
                </label>
            </div>
        </div>

        <div class="row border-1" v-if="previewImage === ''">
            <div class="col-12">
                <div class="camera-button">
                    <button type="button" @click="toggleCamera">
                        <i class="bi bi-camera"></i>
                    </button>
                </div>
                <div v-if="isCameraOpen">
                    <video ref="camera" :width="canvasWidth" :height="canvasHeight" autoplay></video>
                    <canvas v-show="false" id="photoTaken" ref="canvas" :width="canvasWidth"
                            :height="canvasHeight"></canvas>
                </div>
                <button v-if="isCameraOpen" @click="capture">
                    Pildista
                </button>
                <div v-if="pictureData">
                    <div>
                        <img :src="pictureData" alt="Product"/>
                    </div>
                    <button @click="clearImage">X</button>
                </div>
            </div>
        </div>

        <div class="row" v-if="pictureData === ''">
            <div class="col-12">
                <div v-if="previewImage">
                    <div>
                        <img class="preview my-3" style="max-width: 100%;" :src="previewImage" alt="Uploaded"/>
                    </div>
                    <button @click="clearImage">X</button>
                </div>

                <div v-if="message" class="alert alert-secondary" role="alert">
                    {{ message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { OfferService } from '@/bll/service/OfferService'
import { useOfferStore } from '@/stores/offer'
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 14.05.2023
 */
export default defineComponent({
    setup(props: any) {
        const offerService = new OfferService()
        const offerStore = useOfferStore()
        const barcode = props.barcode
        const msg = props.msg

        return {
            offerService,
            offerStore,
            barcode,
            msg,
        }
    },
    components: {},
    props: {
        barcode: String,
        msg: String,
    },
    data () {
        return {
            currentImage: undefined,
            previewImage: '',
            pictureData: '',
            progress: 0,
            message: '',
            imageInfos: [],
            isCameraOpen: false,
            canvasHeight: 200,
            canvasWidth: 190,
            items: [],
        }
    },
    methods: {
        selectImage () {
            this.currentImage = this.$refs.file.files.item(0)
            this.previewImage = URL.createObjectURL(this.currentImage)
            this.offerStore.$state.uploadedImage = URL.createObjectURL(this.currentImage)
            this.progress = 0
            this.message = ''
        },
        toggleCamera () {
            if (this.isCameraOpen) {
                this.isCameraOpen = false
                this.stopCameraStream()
            } else {
                this.isCameraOpen = true
                this.startCameraStream()
            }
        },
        startCameraStream () {
            const constraints = (this.$root.constraints = {
                audio: false,
                video: {
                    facingMode: {
                        exact: 'environment'
                    }
                }
            })
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(stream => {
                    this.$refs.camera.srcObject = stream
                })
                .catch(error => {
                    alert('Browser doesn\'t support or there is some errors.' + error)
                })
        },
        clearImage () {
            this.pictureData = ''
            this.previewImage = ''
            this.offerStore.$state.uploadedImage = ''
        },
        stopCameraStream () {
            const tracks = this.$refs.camera.srcObject.getTracks()
            tracks.forEach((track: any) => {
                track.stop()
            })
        },
        capture () {
            const context = this.$refs.canvas.getContext('2d')
            context.drawImage(this.$refs.camera, 0, 0, this.canvasWidth, this.canvasHeight)
            const dataUrl = this.$refs.canvas.toDataURL("image/jpeg", 0.5)
                .replace('image/jpeg', 'image/octet-stream')
            this.pictureData = dataUrl
            this.offerStore.$state.uploadedImage = dataUrl
            this.isCameraOpen = false
            this.previewImage = ''
            this.stopCameraStream()
        },
        dataURItoBlob(dataURI : any) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            const byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to an ArrayBuffer
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // Old Code
            // write the ArrayBuffer to a blob, and you're done
            // var bb = new BlobBuilder();
            // bb.append(ab);
            // return bb.getBlob(mimeString);

            // New Code
            return new Blob([ab], { type: mimeString });
        }
    }
})
</script>

<style scoped>

</style>
