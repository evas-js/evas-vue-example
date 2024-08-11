/**
 * Абстрактный контракт.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

export class AbstractContract {
    // constructor() {
    //     if (this.constructor == AbstractContract) {
    //         throw new Error("Abstract classes can't be instantiated.");
    //     }
    // }

    // makeApiEndpoints(models) {
    //     return models.reduce((model) => {
    //         this.makeModelApiEndpoints(model)
    //     }, [])
    // }
    // makeModelApiEndpoints(model) {
    //     const { prefix = `/${model.entityName}`, actions = [] } = model?.routes
    //     return actions.map(action => {
    //         // 
    //     })
    // }

    makeEndpointMethodAndUrl(model, action) {
        const modelName = model.entityName
        const { prefix = `/${modelName}`, actions = [] } = model?.routes
        if (!actions.includes(action)) {
            console.warn(`Model "${modelName}" not has route for action "${action}"`)
            return
        }
        const url = ['', prefix, action].join('/').replace('//', '/')
        const method = 'POST'
        return { method, url}
    }

    makeApiEndpoint(model, action, cb) {
        const { method, url } = this.makeEndpointMethodAndUrl(model, action)
        return { method, url, cb }
    }

    makeParamsForApiHandler(model, action, args) {
        const { method, url } = this.makeEndpointMethodAndUrl(model, action)
        return {
            model,
            action,
            method, 
            url,
            args
        }
    }
}
