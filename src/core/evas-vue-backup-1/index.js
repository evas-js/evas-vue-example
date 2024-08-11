/**
 * evas-vue plugin initialization.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */
import { reactive } from 'vue';
import { Api } from './api/Api.js'
import { ModelsStore } from './ModelsStore.js'
import { setModelApi } from './model/Model.api.js'
import { setModelStore } from './model/Model.store.js'
import { setModelState } from './model/Model.state.js'

import { FetchInterceptor } from './api/fetch-interceptor'


export { Model } from './model/Model.js';

const loadedStore = new ModelsStore
const mockStore = new ModelsStore

function cloneModelWithSetStore(model, store) {
    model = class extends model {}
    setModelStore(model, store)
    return model
}

export const EvasVue = new (function () {
    this.models = reactive({})
    this.mocks = {}
    this.api = null
    
    this.debug = true
    this.useModelState = true
    this.useFetchInterceptor = true

    const configurable = [
        'debug', 'useModelState', 'useFetchInterceptor'
    ]

    this.install = (app, options) => {
        if (options) {
            configurable.forEach(key => {
                if (undefined !== options[key]) this[key] = options[key]
            })
            if (options.api) this.setApi(options.api)
            if (options.models) this.setModels(options.models, options.mocks)
            this.setFetchInterceptor()
        }
        app.config.globalProperties.$models = this.models
    };

    this.setApi = (api) => {
        this.api = api instanceof Api ? api : new Api(api)
        if (this.models) Object.values(this.models).forEach(model => model.setApi(this.api))
    }

    this.setModels = (models, mocks) => {
        Object.entries(models).forEach(([name, model]) => this.setModel(name, model, mocks?.[name]))
    }

    this.showStore = (name, model) => {
        console.group(name)
        console.log('size:', model.size())
        console.log('all:', model.all())
        console.log('useApi:', model.useApi)
        console.groupEnd()
    }

    this.setModel = (name, model, mocks) => {
        model.entityName = name
        console.group('setModel ' + name)
        let modelForLoaded = cloneModelWithSetStore(model, loadedStore)
        // if (this.api) modelForLoaded.setApi(this.api)
        if (this.api) setModelApi(modelForLoaded, this.api)
        if (this.useModelState) setModelState(modelForLoaded)
        if (mocks) {
            if (Array.isArray(mocks)) {
                let modelForMocks = cloneModelWithSetStore(model, mockStore)
                modelForMocks.insertOrUpdate(mocks)
                this.showStore('mocks', modelForMocks)
                this.mocks[name] = modelForMocks
            } else {
                console.error(`mocks for model ${name} must be array, ${typeof mocks} given`)
            }
        }
        this.showStore('loaded', modelForLoaded)
        this.models[name] = modelForLoaded
        console.groupEnd()
    }

    this.getModel = (modelName) => {
        return this.models[modelName]
    }

    this.setFetchInterceptor = () => {
        FetchInterceptor.listen([
            'http://itevas.ru',
            'http://evas-php.com'
        ], (interceptor) => {
            interceptor.get('/', () => {
                console.log('Home handler')
            })
            interceptor.get('/users/:id', () => {
                console.log('User id handler')
            })
            interceptor.get('/users/:id([a-zA-Z0-9_-]{1,10})', () => {
                console.log('User id handler')
            })
            interceptor.get('/users/:id/company/:company_id', () => {
                console.log('User id handler')
            })
            interceptor.group('/admin', () => {
                console.log('Admin handler')
            })
            // interceptor.group('/test', (group) => {
            //     group.get('/', () => {
            //         console.log('Test home handler')
            //     })
            // })
            // interceptor.setFormat()
            // interceptor.routesByFormat(new PostFullFormat((routes) => {
            //     routes.crud('User')
            // }))
        })
        // FetchInterceptor.passthrough()
    }
})()
