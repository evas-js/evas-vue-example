import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { EvasVue } from './core/index.js'
import models from './store/models.js'
import api from './api'

// import { Model } from '@/core/Model/Model.js'
// import { User } from '@/store/models/User.js'

// User.fetchList(() => {
//     console.log('loaded')
// })

// // let a = new Model

// // console.log(Model, Model.static(), Model.name1)
// // console.log(a, a.name1)
// // a.hello()
// // console.log(User.setFields())
// // console.log(User.fields())
// let user1 = new User()
// console.log(user1, user1.$state, user1.$isNew, user1.$isDirty, user1.$dirtyData)

// let user2 = new User({name: 'Egor'})
// user2.id = 1
// user2.name = 'Egor2'
// // user2.$saveState()
// console.log(user2, user2.$state, user2.$isNew, user2.$isDirty, user2.$dirtyData)
// // console.log(Model.setFields(), User.setFields())
// // console.log(Model.fields(), User.fields())


createApp(App).use(router)
.use(EvasVue, {
    models, api, 
    // debug: false
    // validate: {
    //     templates: {
    //         'ru': {
    //             'required': () => 'required',
    //             'length': (ctx) => `length, ${ctx.name}`,
    //         },
    //     },
    //     getCurrentLangCb: () => 'en',
    //     // defaultLang: 'ru',
    // }
})
.mount('#app')
