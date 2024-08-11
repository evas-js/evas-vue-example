/**
 * Api для моделей.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { RequestInterceptor } from "./request-interceptor"
import { AbstractContract } from '../contracts/AbstractContract.js'

export class Api {
    endpoints = []
    enabled
    handler
    contract
    requestInterceptor

    defaultHandler(params) {
        console.log('defaultHandler', params)
    }

    constructor({ enabled = true, handler = this.defaultHandler, contract, requestInterceptor }) {
        if (handler && typeof handler !== 'function') {
            throw new Error(`[EvasVue] api handler must be a function, ${typeof callApi} given`)
        }
        // if (!contract) contract = new AbstractContract
        if (contract && !(contract instanceof AbstractContract)) {
            throw new Error('EvasVue] api contract must be implemented of AbstractContract')
        }
        this.enabled = enabled
        this.handler = handler
        this.contract = contract
        this.requestInterceptor = RequestInterceptor.init(requestInterceptor)
    }

    call(model, action, args) {
        return new Promise((resolve, reject) => {
            try {
                const params = this.contract.makeParamsForApiHandler(model, action, args)
                console.log('[API call]', model, action, args)
                let response = this.handler(params)
                if (response && response instanceof Promise) {
                    response
                    .then((response) => {
                        console.log('then', response)
                        resolve(response)
                    })
                    .catch((e) => reject(e))
                } else {
                    resolve(response)
                }
                // this.handler(params, (response) => {
                //     console.log('response', response)
                //     resolve(response)
                // })
            } catch (e) {
                reject(e)
            }
        })
    }

    // addEndpoint(endpoint) {
    //     const key = endpoint.method + endpoint.url
    //     this.endpoints[key] = endpoint
    //     return this
    // }

    // addEndpoints(endpoints) {
    //     endpoints.forEach(endpoint => this.addEndpoint(endpoint))
    //     return this
    // }

    // call(model, action) {
        
    // }
}

// export class Api {
//     endpoints
//     errorCb

//     constructor(endpoints, errorCb) {
//         this.endpoints = endpoints
//         this.errorCb = errorCb
//     }

//     endpoint(parts) {
//         if ('string' === typeof parts) parts = parts.split('.')
//         let handler = this.endpoints
//         for (let sub of parts) {
//             handler = handler[sub]
//             if (!handler) {
//                 throw new Error(
//                     `Api endpoint "${parts.join('.')}" not found. "${sub}" does not exists`
//                 )
//             }
//         }
//         return handler
//     }

//     /**
//      * Вызов эндпоинта
//      * @param { Array|String } parts
//      * @param { Array } args 
//      * @returns { Promise }
//      */
//     call(parts, args) {
//         return new Promise((resolve, reject) => {
//             try {
//                 this.endpoint(parts)(args, (response) => {
//                     console.log('Api.call(', parts, ') response:', response)
//                     resolve(response)
//                 })
//             } catch (e) {
//                 reject(e)
//             }
//         })
//     }
//     // call(parts, args, cb) {
//     //     this.beforeCall(parts, args, cb)
//     //     console.log('evas-vue Api.call(', parts, ')')
//     //     // return new Promise((resolve, reject) => {
//     //         this.endpoint(parts)(args, (data, res) => {
//     //             if (cb) cb(data, res)
//     //             else console.log('Api.call(', parts, ') response:', data, res)
//     //         })
//     //         this.afterCall(parts, args, cb)
//     //     // })
//     // }

//     // api hooks
//     beforeCall() {}
//     afterCall() {}
// }
