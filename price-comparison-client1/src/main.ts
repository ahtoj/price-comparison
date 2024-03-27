import { createApp } from 'vue'
import { createPinia } from 'pinia'
import GoogleSignInPlugin from 'vue3-google-signin'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'leaflet/dist/leaflet.css'

import 'jquery/src/jquery'
import 'popper.js/dist/popper.js'
import 'bootstrap/dist/js/bootstrap.js'
import 'leaflet/dist/leaflet-src.js'
import 'leaflet/dist/images/layers.png'
import 'leaflet/dist/images/layers-2x.png'
import 'leaflet/dist/images/marker-icon.png'
import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'

const app = createApp(App)

if (process.env.NODE_ENV === 'production') {
    app.use(GoogleSignInPlugin, {
        clientId: process.env.GOOGLE_CLIENT_ID
    })
}

app.use(createPinia())
    .use(router)
    .mount('#app')
