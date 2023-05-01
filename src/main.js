import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { EvasVue } from 'evas-vue'

createApp(App).use(router).use(EvasVue).mount('#app')
