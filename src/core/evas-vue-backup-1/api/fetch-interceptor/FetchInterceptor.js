/**
 * Перехватчик fetch-запросов.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { RoutesGroup } from './RoutesGroup.js'

function itemOrSubItemHandle(item, handler) {
    return Array.isArray(item)
        ? item.some(subItem => handler(subItem))
        : handler(item)
}

export class FetchInterceptor extends RoutesGroup {
    static interceptors = []
    static _passthrough = false

    static get hasInterceptors() {
        return this.interceptors.length > 0
    }

    static run() {
        const { fetch: originalFetch } = window
        window.fetch = (...args) => this.listener(originalFetch, args)
    }

    static async listener(originalFetch, args) {
        let [resource, config ] = args
        let interceptor = this.interceptors.find(
            item => itemOrSubItemHandle(item.urlPrefix, (value) => resource.startsWith(value))
        )
        if (!interceptor) {
            if (this._passthrough) {
                return await originalFetch(resource, config)
            } else {
                return console.warn('[evas-vue FetchInterceptor]'
                + ' a request for a resource that is not registered'
                + ' for interception has been stopped (passthrough not enabled)'
                , resource, config)
            }
        }
        console.log('[evas-vue FetchInterceptor]', resource, config)
        if (!interceptor.callHandler(resource, config)) {
            return await originalFetch(resource, config)
        }
    }

    /**
     * Создание перехватчика
     * @param { String|String[] } urlPrefix префикс или массив префиксов адресов перехватчика
     * @param { Function } cb колбэк для настройки перехватчика
     * @returns { this }
     */
    static listen(urlPrefix, cb) {
        let interceptor = new this(urlPrefix)
        if ('function' == typeof cb) cb(interceptor)
        return this
    }

    /**
     * Включить/выключить прохождение адресов без перехватчиков
     * @param { Boolean|true } value Включить/выключить
     * @returns { this }
     */
    static passthrough(value = true) {
        this._passthrough = value
        return this
    }
    
    urlPrefix
    _routes = {}

    constructor(urlPrefix) {
        super()
        let hasInterceptors = this.constructor.hasInterceptors
        let finded = this.constructor.interceptors.some(
            item => itemOrSubItemHandle(item.urlPrefix, (value) => value === urlPrefix)
        )
        if (!finded) {
            this.urlPrefix = urlPrefix
            this.constructor.interceptors.push(this)
            if (!hasInterceptors) {
                this.constructor.run()
            }
        }
    }
}
