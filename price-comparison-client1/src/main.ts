import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'

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

import et from './locales/et.json'
import en from './locales/en.json'

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: { et, en },
})

createApp(App)
    .use(createPinia())
    .use(router)
    .use(i18n)
    .mount('#app')
