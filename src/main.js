import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { EvasVue } from 'evas-vue'
import { models } from '@/store/models.js'
import { api } from '@/api'

createApp(App).use(router)
.use(EvasVue, {
    models, api
})
.mount('#app')
