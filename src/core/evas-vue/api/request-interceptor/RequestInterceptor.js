/**
 * Перехватчик fetch-запросов.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { RoutesGroup } from './RoutesGroup.js'
import { Request } from './Request.js'

function itemOrSubItemHandle(item, handler) {
    return Array.isArray(item)
        ? item.some(subItem => handler(subItem))
        : handler(item)
}

export class RequestInterceptor extends RoutesGroup {
    static interceptors = []
    static _passthrough = false
    static XMLHttpRequestArgs

    static enabled
    static mocks = {}

    static get hasInterceptors() {
        return this.interceptors.length > 0
    }

    static init({ enabled = true, init, mocks }) {
        this.enabled = enabled
        this.mocks = mocks
        init(this)
        return this
    }

    static addMocksModel(mocksModel) {
        this.mocks[mocksModel.entityName] = mocksModel
        return this
    }

    static run() {
        const { fetch: originalFetch } = window
        window.fetch = (...args) => this.fetchListener(originalFetch, ...args)

        const self = this
        const { 
            open: originalOpen, 
            setRequestHeader: originalSetRequestHeader, 
            send: originalSend,
            // overrideMimeType: originalOverrideMimeType,
        } = XMLHttpRequest.prototype

        XMLHttpRequest.prototype.open = function (...args) {
            const keys = ['method', 'url', 'async', 'user', 'password']
            self.XMLHttpRequestArgs = args.reduce((params, arg, i) => {
                params[keys[i]] = arg
                return params
            }, {})
            // console.log('open', ...args)
            return originalOpen.call(this, ...args)
        }
        XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
            if (!self.XMLHttpRequestArgs?.headers) self.XMLHttpRequestArgs.headers = {}
            self.XMLHttpRequestArgs.headers[name] = value
            return originalSetRequestHeader.call(this, name, value)
        }
        // XMLHttpRequest.prototype.overrideMimeType = function (value) {
        //     return originalOverrideMimeType.call(this, value)
        // }
        XMLHttpRequest.prototype.send = function (body) {
            if (body) self.XMLHttpRequestArgs.body = body
            // console.log('send', self.XMLHttpRequestArgs, this)
            return self.xhrListener(originalSend.bind(this), self.XMLHttpRequestArgs)
        }
    }

    static findInterceptor(url) {
        return this.interceptors.find(
            item => itemOrSubItemHandle(item.urlPrefix, (value) => url.startsWith(value))
        )
    }

    static listener(original, args) {
        let interceptor = this.findInterceptor(args.url)
        if (!interceptor) {
            if (this._passthrough) {
                return original(args)
            } else {
                return console.warn('[evas-vue RequestInterceptor]'
                + ' a request for a resource that is not registered'
                + ' for interception has been stopped (passthrough not enabled)'
                , args)
            }
        }
        console.log('[evas-vue RequestInterceptor]', args)
        if (!interceptor.callHandler(args)) {
            return original(args)
        }
    }

    static async fetchListener(originalFetch, resource, config) {
        return await this.listener(
            (args) => originalFetch(args.url, args), 
            Request.fromFetch(resource, config)
        )
    }

    static xhrListener(originalSend, args) {
        return this.listener(
            (args) => originalSend(args.body), 
            Request.fromXHR(args)
        )
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


    /**
     * Установка маршрута
     * @param { String } method HTTP-метод
     * @param { String } path путь
     * @param { Function } cb обработчик
     */
    // route(method, path, cb) {
    addRoute(method, path) {
        method = method.toUpperCase()
        if (!this._routes[method]) this._routes[method] = {}

        // const [, key, , pattern] = part.match(/:(?<key>.[^()])(\((?<pattern>.*)\))?/)
        // const { key, pattern } = /:(?<key>.[^()])(\((?<pattern>.*)\))?/.exec(part).groups
        
        // this._routes[method] = objectAssignRecursive(this._routes[method], route)
        console.log(`Add [${method}] ${path}`)

        return this
    }

    syncFromApi(api) {
        function deep(items, fullLKey = '') {
            let result = {}
            if (items && typeof items === 'object') Object.entries(items).forEach(([key, item]) => {
                key = `${fullLKey}/${key}`
                if (typeof item === 'function') {
                    result[key] = item
                } else {
                    Object.entries(deep(item, key)).forEach(([key2, item2]) => {
                        result[key2] = item2
                    })
                }
            })
            return result
        }
        if (api) {
            let result = deep(api)
            console.log(result)
        }
    }
}
