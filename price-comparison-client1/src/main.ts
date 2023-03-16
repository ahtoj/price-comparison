import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import 'jquery'
// import 'popper.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

// import "bootstrap/dist/js/bootstrap.js"

createApp(App)
    .use(createPinia())
    .use(router)
    .mount('#app')
