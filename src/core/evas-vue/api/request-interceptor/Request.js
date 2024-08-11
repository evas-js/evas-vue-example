/**
 * Класс запроса.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

export class Request {
    url
    method = 'GET'
    headers
    body
    params = {}

    static fromFetch(resource, config) {
        return new this({ ...config, url: resource })
    }

    static fromXHR(props) {
        return new this(props)
    }

    constructor(props) {
        for (let [key, value] of Object.entries(props)) {
            if ('method' === key) value = (value || 'GET').toUpperCase()
            this[key] = value
        }
    }

    setParams(params) {
        this.params = Object.assign(this.params, params)
        return this
    }
}
