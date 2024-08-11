/**
 * Модель.
 * @package evas-vue-core
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

export class Model {
    static entityName = null
    static primary = 'id'

    set(target, key, value) {
        const field = target.constructor?.field(key)
        if (field) {
            value = field.convertTypeWithDefault(value)
        }
        target[key] = value
        return true
    }
    
    constructor (data, afterFetch = true) {
        this.$beforeNew(data, afterFetch)
        if (!data) data = {}
        this.$fill(data)
        const proxy = new Proxy(this, this)
        if (!afterFetch || this.$id) {
            this.constructor.insertOrUpdate(proxy, afterFetch)
        }
        return proxy
    }

    get $entityName() {
        return this.constructor.entityName
    }

    get $entityNameWithId() {
        return `${this.$entityName}{${this.$id}}`
    }

    set $id (value) {
        this.set(this, this.constructor.primary, value)
    }
    get $id () {
        return this[this.constructor.primary]
    }

    $saveState() {}

    /** @var { Boolean } Является ли запись новой */
    get $isNew () {
        return this.$id ? false : true
    }

    // Заполнение записей

    /**
     * Заполнение свойств записи.
     * @param { Object } data данные [имя поля/связи => значение]
     */
    $fill (data) {
        this.$fillFields(data)
        this.$fillRelatons(data)
    }
    /**
     * Заполнение свойств-полей записи.
     * @param { Object } data данные [имя поля => значение]
     */
    $fillFields (data) {
        this.constructor.eachFields((field) => {
            // конвертируем тип значения
            this.set(this, field.name, field.convertTypeWithDefault(data[field.name]))
        })
        this.$saveState()
    }
    /**
     * Заполнение свойств-связей записи.
     * @param { Object } data данные [имя связи => значение]
     */
    $fillRelatons (data) {
        this.constructor.eachRelations((field) => {
            if (undefined === data[field.name]) return
            this[field.name] = data[field.name]
            // записываем связанные записи в их модели
            field.foreignModel.insertOrUpdate(data[field.name], true)
        })
    }
}

// Хуки модели
Model.prototype.$beforeNew = function () {}

// Расширения модели
// require('./Model.api.js') // deprecated
require('./Model.crud.js')
require('./Model.fields.js')
// require('./Model.fields.display.js')
require('./Model.relations.js')
require('./Model.query.js')
// require('./Model.state.js') // deprecated
// require('./Model.store.js') // deprecated
// require('./Model.validate.js')
