/**
 * Расширение модели поддержкой api.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { Api, FetchedDataParser } from '../api'
import { Model } from './Model.js'

export function setModelApi(model, api) {
    model.setApi = function (api) {
        this.api = api instanceof Api ? api : new Api(api)
    }
    model.setApi(api)
    // model.api = api instanceof Api ? api : new Api(api)
    model.useApi = true

    model.getApiRoute = function (name) {
        if (!this.routes) throw new Error(`${this.entityName} routes does not exists`)
        if (!this.routes[name]) throw new Error(`${this.entityName} not has route ${name}`)
        if (!this.api) throw new Error(`Api object does not provide to ${this.entityName} model`)
        return this.routes[name]
    }
    
    model.hasApiRoute = function (name) {
        try {
            this.getApiRoute(name)
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }

    /** @var { FetchedDataParser } парсер полученных данных */
    model.fetchedDataParser = new FetchedDataParser(model)

    /**
     * Обработчик полученных данных.
     * @param { any } data данные
     * @param { Response } res
     * @param { String } name имя вызванного метода
     * @returns { Promise }
     */
    model.apiDataFetched = function (data, res, name) {    
        console.log('apiDataFetched', data)
        // hooked data
        const hooked = this.beforeFetched(name, data, res)
        if (hooked?.data) data = hooked.data
        
        let entities = this.fetchedDataParser.parse(data)
        return [entities, data]
    }

    /**
     * Вызов api-эндпоинта без сохранения разультата.
     * @param { Array|String } name имя эндпоинта
     * @param { any } args аргументы вызова
     * @returns { Promise }
     */
    model.callApiRoute = function (name, args) {
        return this.api.call(this.getApiRoute(name), args)
    }


    /**
     * Вызов api-эндпоинта с сохранением результатов запроса.
     * @param { Array|String } name имя эндпоинта
     * @param { any } args аргументы вызова
     * @returns { Promise }
     */
    model.fetch = function (name, args) {
        if (!this.api) return console.error(`Api not enabled for model "${this.entityName}"`)
        if (args instanceof Model) args = Object.assign({}, args)
        
        const hooked = this.beforeFetch(name, args)
        // hooked args
        if (hooked?.args) args = hooked.args

        // return this.callApiRoute(
        //     name, args, (data, res) => this.apiDataFetched(data, res, name)
        // )
        return new Promise((resolve) => {
            this.callApiRoute(name, args).then((data, res) => {
                console.log('fetch', data)
                resolve(...this.apiDataFetched(data, res, name))
            })
        })
    }


    // Вызов CRUD api-эндпоинта.

    model.fetchList = function (args) {
        return this.fetch('list', args)
    }

    model.fetchOne = function (args) {
        return this.fetch('one', args)
    }

    model.fetchInsert = function (args) {
        return this.fetch('insert', args)
    }

    model.fetchUpdate = function (args) {
        return this.fetch('update', args)
    }

    model.fetchDelete = function (args) {
        return this.fetch('delete', args)
    }


    // Model api hooks
    model.beforeFetch = function (name, args) {
        return { args }
    }
    model.beforeFetched = function (name, data) {
        return { data }
    }
    model.afterFetched = function () {}
    model.beforeSubFetched = function () {}
    model.afterSubFetched = function () {}

}

// Model.api
// Model.useApi = true

// Model.setApi = function (api) {
//     this.api = api instanceof Api ? api : new Api(api)
// }

// Model.getApiRoute = function (name) {
//     if (!this.routes) {
//         throw new Error(`${this.entityName} routes does not exists`)
//     }
//     if (!this.routes[name]) {
//         throw new Error(`${this.entityName} not has route ${name}`)
//     }
//     if (!this.api) {
//         throw new Error(
//             `Api object does not provide to ${this.entityName} model`
//         )
//     }
//     return this.routes[name]
// }

// Model.hasApiRoute = function (name) {
//     try {
//         this.getApiRoute(name)
//     } catch (e) {
//         console.error(e)
//         return false
//     }
//     return true
// }


// /**
//  * Обработка данных полученных через fetch.
//  * @param mixed данные
//  * @param Response
//  * @param String имя вызванного метода
//  * @param Function колбэк
//  */
// Model.apiDataFetched = function (data, res, name, cb) {    
//     const hooked = this.beforeFetched(name, data, res)
//     // hooked data
//     if (hooked?.data) data = hooked.data
//     // console.log(name, 'fetched api data:', data)
//     if (data) {
//         if (data.$data) {
//             data.$data.forEach((sub) => {
//                 let type = sub.type || this.entityName
//                 let model = EvasVue.getModel(type)
//                 if (!model) {
//                     console.error(`Model ${type} not found`)
//                     return
//                 }
//                 this.beforeSubFetched(type, sub)
//                 let entities = model.insertOrUpdate(sub.rows, true)
//                 if (![undefined, null].includes(sub.totalRows)) model.totalRows = sub.totalRows
//                 if (cb) cb(sub, entities, res)
//                 this.afterSubFetched(type, entities)
//             })
//         } else {
//             let entities = this.insertOrUpdate(data, true)
//             if (cb) cb(data, entities, res)
//             this.afterFetched(name, data, entities, res)
//         }
//     } else cb(data)
// }


// // Вызов api-эндпоинта


// /**
//  * Вызов api-эндпоинта без сохранения разультата.
//  * @param Array|String имя эндпоинта
//  * @param mixed аргументы вызова
//  * @param Function колбэк
//  */
// Model.callApiRoute = function (name, args, cb) {
//     let parts = this.getApiRoute(name)
//     return this.api.call(parts, args, (data, res) => cb(data, res))
// }

// /**
//  * Вызов api-эндпоинта с сохранением результатов запроса.
//  * @param Array|String имя эндпоинта
//  * @param mixed аргументы вызова
//  * @param Function колбэк
//  */
// Model.fetch = function (name, args, cb) {
//     if (!this.api) {
//         return console.error(`Api not enabled for model "${this.entityName}"`)
//     }
//     if (args instanceof Model) args = Object.assign({}, args)
    
//     const hooked = this.beforeFetch(name, args, cb)
//     // hooked args
//     if (hooked?.args) args = hooked.args

//     return this.callApiRoute(
//         name, args, (data, res) => this.apiDataFetched(data, res, name, cb)
//     )
// }


// // Вызов CRUD api-эндпоинта.

// Model.fetchList = function (args, cb) {
//     this.fetch('list', args, cb)
// }

// Model.fetchOne = function (args, cb) {
//     this.fetch('one', args, cb)
// }

// Model.fetchInsert = function (args, cb) {
//     this.fetch('insert', args, cb)
// }

// Model.fetchUpdate = function (args, cb) {
//     this.fetch('update', args, cb)
// }

// Model.fetchDelete = function (args, cb) {
//     this.fetch('delete', args, cb)
// }


// // Model api hooks
// Model.beforeFetch = function (name, args) {
//     return { args }
// }
// Model.beforeFetched = function (name, data) {
//     return { data }
// }
// Model.afterFetched = function () {}
// Model.beforeSubFetched = function () {}
// Model.afterSubFetched = function () {}
