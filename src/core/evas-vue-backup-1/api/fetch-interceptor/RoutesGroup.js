/**
 * Группировка роутов перехватчика fetch-запросов.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

function isObject(target) {
    return target && typeof target === 'object'
}

function objectAssignRecursive(target, ...sources) {
    if (!sources.length) return target
    const source = sources.shift()
    if (isObject(target) && isObject(source)) {    
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                else target[key] = Object.assign({}, target[key])
                objectAssignRecursive(target[key], source[key])
            } 
            else Object.assign(target, { [key]: source[key] })
        }
    }  
    return objectAssignRecursive(target, ...sources)
}

export class RoutesGroup {
    urlPrefix
    _routes = {}

    constructor(urlPrefix, cb) {
        this.urlPrefix = urlPrefix
        if ('function' === typeof cb) cb.call(this)
    }

    /**
     * Установка маршрута
     * @param { String } method HTTP-метод
     * @param { String } path путь
     * @param { Function } cb обработчик
     */
    route(method, path, cb) {
        method = method.toUpperCase()
        if (!this._routes[method]) this._routes[method] = {}

        let parts = path.split('/')
        parts.shift()
        let paramNames = []
        let route = parts.reverse().reduce((route, part) => {
            let computed = part.startsWith(':')
            route = { children: route, computed }
            if (computed) {
                // const [, key, , pattern] = part.match(/:(?<key>.[^()])(\((?<pattern>.*)\))?/)
                const { key, pattern } = /:(?<key>.[^()])(\((?<pattern>.*)\))?/.exec(part).groups
                if (paramNames.includes(key)) {
                    throw new Error(`Duplicate param name ":${key}" in route [${method}] "${path}"`)
                }
                paramNames.push(key)
                route = { ...route, key, pattern }
            }
            return { [part]: route }
        }, { cb })
        
        this._routes[method] = objectAssignRecursive(this._routes[method], route)

        return this
    }

    get(path, cb) {
        return this.route('GET', path, cb)
    }

    group(path, cb) {
        return this.route('ALL', path, (resource, config) => {
            let group = new this.constructor(path)
            cb.call(group)
            group.callHandler(resource, config)
        })
    }

    checkpoints = []

    findHandler(method, path) {
        method = (method || 'GET').toUpperCase()
        let routes = objectAssignRecursive(this._routes[method], this._routes['ALL'])
        // console.log('routes', routes)
        // console.log('path', path)
        let parts = path.split('/')
        parts.shift()
        // console.log('parts', parts)
        let route = this._findHandler(routes, parts)
        return route
    }

    _findHandler(routes, parts) {
        this.checkpoints.push({})
        console.group('_findHandler', JSON.stringify(parts))
        let route = parts.reduce((route, part, i) => {
            console.group(part)
            route = this._findHandlerIteration(route, part, i, parts)
            console.log('route', route) 
            console.groupEnd()
            return route
        } , routes)
        console.groupEnd()
        this.checkpoints.pop()
        return route
    }

    _findHandlerIteration(route, part, i, parts) {
        // return route?.children ? route.children[part] : route?.[part]
        if (route?.children) {
            if (route.children?.[part] && !route.children[part]?.key) return route.children[part]

            for (let child of Object.values(route.children)) {
                console.log('child', child)
                if (!child.key) continue
                if (child.pattern) {
                    let matched = part.match(`^${child.pattern}`)
                    if (matched) {
                        this.checkpoints.at(-1)[child.key] = matched
                        let _route = this._findHandler(child, parts.slice(i + 1))
                        if (_route) return _route
                    }
                } else {
                    let _route = this._findHandler(child, parts.slice(i + 1))
                    if (_route) return _route
                }
            }
        }
        if (route?.[part]) return route[part]
    }

    callHandler(resource, config) {
        let urlPrefix = Array.isArray(this.urlPrefix) 
        ? this.urlPrefix.find(item => resource.startsWith(item))
        : this.urlPrefix

        this.checkpoints = []

        let path = resource.replace(urlPrefix, '')
        let route = this.findHandler(config?.method, path)

        console.log('route', route)

        return true
        // let cb = routes?.[path]
        // if (cb) {
        //     cb(resource, config)
        //     return true
        // }
        // return false
    }
}
