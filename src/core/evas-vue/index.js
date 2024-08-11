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

export { RequestInterceptor } from './api/request-interceptor'
export { Model } from './model/Model.js';

const loadedStore = new ModelsStore
const mockStore = new ModelsStore

function cloneModelWithSetStore(model, store) {
    model = class extends model {}
    setModelStore(model, store)
    return model
}

export const EvasVue = new (function () {
    this.debug
    this.models = reactive({})
    this.useModelState
    this.api
    this.mocks = {}

    this.install = (app, options) => {
        if (options) this.setOptions(options)
        app.config.globalProperties.$models = this.models
    };

    this.setOptions = ({ debug = false, models, useModelState = true, api }) => {
        this.debug = debug
        this.useModelState = useModelState
        if (api) this.setApi(api)
        if (models) this.setModels(models, api?.requestInterceptor?.mocks)
        // if (api?.requestInterceptor?.mocks && this.mocks.length) api.requestInterceptor.mocks = this.mocks
    }

    this.setApi = (api) => {
        this.api = api instanceof Api ? api : new Api(api)
    }

    // this.setRequestInterceptor = ({ enabled = true, init, mocks }) => {
    //     // 
    // }

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
        if (this.api) setModelApi(modelForLoaded, this.api)
        if (this.useModelState) setModelState(modelForLoaded)
        if (mocks) {
            if (Array.isArray(mocks)) {
                let modelForMocks = cloneModelWithSetStore(model, mockStore)
                modelForMocks.insertOrUpdate(mocks)
                this.showStore('mocks', modelForMocks)
                // this.mocks[name] = modelForMocks
                this.api.requestInterceptor.addMocksModel(modelForMocks)
            } else {
                console.error(`mocks for model ${name} must be array, ${typeof mocks} given`)
            }
        }
        this.showStore('loaded', modelForLoaded)
        this.models[name] = modelForLoaded
        console.groupEnd()
    }

    // this.fillMocks = (name, model, mocks) => {
    //     // 
    // }

    this.getModel = (modelName) => {
        return this.models[modelName]
    }
})()
