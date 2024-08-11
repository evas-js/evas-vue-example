import { createApp } from 'vue'
import App from './App.vue'

import api from './api'
import models from './store/models.js'
import { EvasVue } from './core/evas-vue'

import { createWebHistory, createRouter } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import UserListPage from './pages/UserListPage.vue'
import UserShowPage from './pages/UserShowPage.vue'
import UserEditPage from './pages/UserEditPage.vue'

import TableView from '@/parts/table/TableView'
import BaseBtn from '@/parts/common/BaseBtn'
import StringField from '@/parts/fields/StringField'
import SelectField from '@/parts/fields/SelectField'
import TextField from '@/parts/fields/TextField'

const routes = [
    { path: '/', component: HomePage },
    { path: '/user', component: UserListPage },
    { path: '/user/show/:id', component: UserShowPage },
    { path: '/user/edit/:id', component: UserEditPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App)
    .component('TableView', TableView)
    .component('BaseBtn', BaseBtn)
    .component('StringField', StringField)
    .component('SelectField', SelectField)
    .component('TextField', TextField)

    .use(router)
    // .use(EvasVue, { models, callApi, mocks, initRequestInterceptor })
    .use(EvasVue, {
        debug: true,
        // useModelState: true,
        models, 
        api
        // : {
        //     enabled: true,
        //     handler,
        //     contract,
        //     requestInterceptor: {
        //         enabled: true,
        //         init,
        //         mocks,
        //     },
        // }
    })
    .mount('#app')
