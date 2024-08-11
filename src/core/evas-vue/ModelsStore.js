/**
 * Хранилище моделей.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { reactive } from 'vue'

export class ModelsStore {
    /** @var { Proxy<Map> } маппинг записей по именам моделей */
    map = reactive({})

    /**
     * Получение Map записей модели.
     * @param { String } имя модели
     * @returns { Proxy<Map> }
     */
    model(name) {
        if (!this.map[name]) {
            this.map[name] = new Map
        }
        return this.map[name]
    }

    /** @var { Proxy<Object> } мапинг totalRows по именам модели */
    _totalRows = reactive({})

    /**
     * Получение totalRows модели.
     * @param { String } name имя модели
     * @returns { Number } totalRows модели
     */
    totalRows(name) {
        return this._totalRows[name] || 0
    }

    /**
     * Установка totalRows модели.
     * @param { String } name имя модели
     * @param { Number } value totalRows
     * @returns { this }
     */
    setTotalRows(name, value) {
        this._totalRows[name] = value
        return this
    }
}
