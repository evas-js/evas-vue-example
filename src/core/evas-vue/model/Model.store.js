/**
 * Расширение модели поддержкой хранилища моделей.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

export function setModelStore(model, store) {
    // map
    Object.defineProperty(model, 'map', { 
        get: function () {
            return store.model(this.entityName) 
        }
    })
    // total rows
    Object.defineProperty(model, 'totalRows', {
        set: function (value) {
            store.setTotalRows(this.entityName, value)
        },
        get: function () {
            return store.totalRows(this.entityName)
        }
    })

    // size, all, each, clear

    /**
     * Получение количества загруженных записей.
     * @returns { Number }
     */
    model.size = function () {
        return this.map.size
    }

    /**
     * Получение всех загруженных записей.
     * @returns { Model[] }
     */
    model.all = function () {
        return Array.from(this.map.values())
    }

    /**
     * Итеративная обработка загруженных записей.
     * @param { Function } cb колбэк обработки
     */
    model.each = function (cb) {
        if (!cb) return
        this.map.forEach((entity) => cb(entity))
    }

    /**
     * Очистка записей модели в хранилище.
     * @returns { this } this
     */
    model.clear = function () {
        this.map.clear()
        return this
    }
}
