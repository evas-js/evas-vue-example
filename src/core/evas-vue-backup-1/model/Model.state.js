/**
 * Расширение модели поддержкой состоянием.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { Relation } from './Relation.js'

export function setModelState(model) {
    model.prototype.$state = {}

    /** @var { Boolean } Является ли запись "грязной" (с изменёнными, но не сохранёнными данными) */
    Object.defineProperty(model.prototype, '$isDirty', { get: function () {
        return this.$dirtyFields().length > 0
    }})

    /** @var { Object } изменённые данные {key: val, ...} */
    Object.defineProperty(model.prototype, '$dirtyData', { get: function () {
        let data = {}
        this.$dirtyFields().forEach((name) => (data[name] = this[name]))
        return data
    }})

    /**
     * Сохранение состояния записи.
     */
    model.prototype.$saveState = function () {
        this.$state = structuredClone(this)
        delete this.$state.$state
        delete this.$state.$displayGroup
        delete this.$state.$errors
    }

    /**
     * Откат изменений записи.
     * @param { Array|null } name имена полей и/или связей
     */
    model.prototype.$rollbackChanges = function (names) {
        const cb = field => {this[field.name] = structuredClone(this.$state[field.name])}
        this.constructor.eachFields(cb, names)
        this.constructor.eachRelations(cb, names)
    }


    /**
     * Проверка поля на изменённость.
     * @param { String|Number } name имя поля
     * @returns { Boolean }
     */
    model.prototype.$isDirtyField = function (name) {
        let stateValue = this.$state[name]
        if (Array.isArray(stateValue) && Array.isArray(this[name])) {
            return JSON.stringify(stateValue.sort()) !== JSON.stringify(this[name].sort())
        } else if (typeof(stateValue) === 'object' && ![null, undefined].includes(stateValue)) {
            return JSON.stringify(stateValue) !== JSON.stringify(this[name])
        }
        return stateValue !== this[name]
    }

    /**
     * Проверка связанных записей на изменённость.
     * @param { String|Number|Relation } relation имя связи или связь
     * @returns { Boolean }
     */
    model.prototype.$isDirtyRelateds = function (relation) {
        if (!(relation instanceof Relation)) relation = this.relation()[relation]
        let {name, local, foreign, multiple} = relation
        if (multiple) {
            if (Array.isArray(this[name])) {
                let res = false
                let ids = []
                this[name].forEach(related => {
                    if (related[foreign]) ids.push(related[foreign])
                })
                if (Array.isArray(this.$state[name])) {
                    let idsLocal = []
                    this.$state[name].forEach(related => {
                        if (related[foreign]) idsLocal.push(related[foreign])
                    })
                    res = JSON.stringify(ids.sort()) !== JSON.stringify(idsLocal.sort())
                }
                if (res && Array.isArray(this.$state?.[local])) {
                    res = JSON.stringify(ids.sort()) !== JSON.stringify(this.$state?.[local].sort())
                }
                return res
            }
        } else {
            let res = this.$state[name]?.[foreign] !== this[name]?.[foreign]
            if (res) {
                return this.$state?.[local] !== this[name]?.[foreign]
            }
        }
    }

    /**
     * Получение имён изменённых полей и связанных записей.
     * @param { Array|null } names имена полей и/или связей
     * @returns { String[] }
     */
    model.prototype.$dirtyFields = function (names) {
        let dirty = []
        this.constructor.eachFields((field) => {
            if (this.$isDirtyField(field.name)) dirty.push(field.name)
        }, names)
        this.constructor.eachRelations((relation) => {
            if (this.$isDirtyRelateds(relation)) dirty.push(relation.name)
        }, names)
        return dirty
    }
}
