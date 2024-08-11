/**
 * Api для моделей.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

export class Api {
    endpoints
    errorCb

    constructor(endpoints, errorCb) {
        this.endpoints = endpoints
        this.errorCb = errorCb
    }

    endpoint(parts) {
        if ('string' === typeof parts) parts = parts.split('.')
        let handler = this.endpoints
        for (let sub of parts) {
            handler = handler[sub]
            if (!handler) {
                throw new Error(
                    `Api endpoint "${parts.join('.')}" not found. "${sub}" does not exists`
                )
            }
        }
        return handler
    }

    /**
     * Вызов эндпоинта
     * @param { Array|String } parts
     * @param { Array } args 
     * @returns { Promise }
     */
    call(parts, args) {
        return new Promise((resolve, reject) => {
            try {
                this.endpoint(parts)(args, (data, res) => {
                    console.log('Api.call(', parts, ') response:', data, res)
                    resolve(data, res)
                })
            } catch (e) {
                reject(e)
            }
        })
    }
    // call(parts, args, cb) {
    //     this.beforeCall(parts, args, cb)
    //     console.log('evas-vue Api.call(', parts, ')')
    //     // return new Promise((resolve, reject) => {
    //         this.endpoint(parts)(args, (data, res) => {
    //             if (cb) cb(data, res)
    //             else console.log('Api.call(', parts, ') response:', data, res)
    //         })
    //         this.afterCall(parts, args, cb)
    //     // })
    // }

    // api hooks
    beforeCall() {}
    afterCall() {}
}
