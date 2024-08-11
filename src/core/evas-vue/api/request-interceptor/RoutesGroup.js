/**
 * Группировка роутов перехватчика fetch-запросов.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

export class RoutesGroup {
    urlPrefix
    // _routes = {}
    _routesSimple = {}
    _routesComputed = {}

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
    // route(method, path) {
        method = method.toUpperCase()
        if (!this._routes[method]) this._routes[method] = {}

        console.log(`Add [${method}] ${path}`)
        // const [, key, , pattern] = part.match(/:(?<key>.[^()])(\((?<pattern>.*)\))?/)
        // const { key, pattern } = /:(?<key>.[^()])(\((?<pattern>.*)\))?/.exec(part).groups

        // let regexp = new RegExp(':(?<key>.[^(])(\((?<pattern>.*)\))?', 'g')
        // const regexp = new RegExp(':(?<key>[a-zA-Z_\\$][a-zA-Z0-9_\\$]*)(\\((?<pattern>.*)\\))?', 'g')

        // const params = []
        const regexp = /:(?<key>[a-zA-Z_\\$][a-zA-Z0-9_\\$]*)(\((?<pattern>.*)\))?/g
        let find, paramsCount = 0
        let newPath = path
        while (!!(find = regexp.exec(path)) && paramsCount++ < 10) {

            // console.log(find.index, regexp.lastIndex)
            // params.push(find)
            let origin = path.substring(find.index, regexp.lastIndex)
            let { key, pattern } = find.groups
            let replacement = `(?<${key}>${pattern ?? '[^\\/]+'})`
            // console.log(origin, replacement)
            if (paramsCount < 2) newPath = newPath.replaceAll('/', '\\/')
            newPath = newPath.replace(origin, replacement)

        }
        // console.log(regexp.exec(path)?.groups)
        // console.log(regexp.exec(path))

        function addRoute(list, method, path) {
            if (!list[method]) list[method] = {}
            list[method][path] = cb
        }

        if (paramsCount) {
        // if (params.length) {
            console.log(newPath)
            addRoute(this._routesComputed, method, newPath)
            // this._routesComputed[method] = path
        } else {
            addRoute(this._routesSimple, method, newPath)
            // this._routesSimple[method] = path
        }
        
        // this._routes[method] = objectAssignRecursive(this._routes[method], route)
        
        return this
    }
    
    get(path, cb) {
        return this.route('GET', path, cb)
    }

    post(path, cb) {
        return this.route('POST', path, cb)
    }

    group(path, cb) {
        return this.route('ALL', path, (resource, config) => {
            let group = new this.constructor(path)
            cb.call(group)
            group.callHandler(resource, config)
        })
    }

    callHandler(request) {
        let urlPrefix = Array.isArray(this.urlPrefix) 
        ? this.urlPrefix.find(item => request.url.startsWith(item))
        : this.urlPrefix

        this.checkpoints = []

        let method = (request?.method || 'GET').toUpperCase()
        let path = request.url.replace(urlPrefix, '')

        console.log(`Call [${method}] ${path}`)
        // console.log('simple', this._routesSimple)
        // console.log('computed', this._routesComputed)

        function withAll(list) {
            return (method === 'ALL') ? list['ALL'] ?? {} : Object.assign(list['ALL'] ?? {}, list[method])
        }

        let cb = withAll(this._routesSimple)?.[path]
        if ('function' === typeof cb) {
            cb(request)
            return true
        }

        for (let [pattern, cb] of Object.entries(withAll(this._routesComputed))) {
            // console.log(pattern, cb)
            let find = new RegExp(`^${pattern}$`).exec(path)?.groups
            // console.log(find)
            if (find) {
                request.setParams(find)
                if ('function' === typeof cb) {
                    cb(request)
                    return true
                }
            }
        }
        

        return true
        // let cb = routes?.[path]
        // if (cb) {
        //     cb(resource, config)
        //     return true
        // }
        // return false
    }
}
