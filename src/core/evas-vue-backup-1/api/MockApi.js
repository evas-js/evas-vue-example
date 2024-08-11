/**
 * Хелпер работы с моками для моделей.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

// import { EvasVue } from '../index.js'
import { ModelsStoreConstructor } from '../ModelsStore.js'

export class MockApi {
    models = {}
    store
    
    get(target, prop) {
        return target.models[prop]
    }

    constructor(models) {
        this.store = new ModelsStoreConstructor
        // let models = structuredClone(EvasVue.models) // error!
        models = structuredClone(models)
        this.setModels(models)
        return new Proxy(this, this)
    }
    setModels(models) {
        Object.entries(models).forEach(([name, model]) => {
            model.entityName = name
            this.models[name] = model
            Object.defineProperty(model, 'map', { 
                get: function () {
                    return this.store.model(this.entityName) 
                }
            })
        })
    }
}
