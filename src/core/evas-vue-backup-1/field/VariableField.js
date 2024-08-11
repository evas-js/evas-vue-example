/**
 * Вариативное поле.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { Fieldable } from './Fieldable.js'
import { setProps } from './FieldableBuilder.js'

export class VariableField extends Fieldable {
    /** @var { String } тип вариативного поля (oneOf, anyOf, allOf) */
    type
    /** @var { FieldBuilder[]|Field[] } поля */
    fields
    /** @var { Array } ошибки валидации */
    errors = []

    /**
     * @param { Object|null } props свойства поля
     */
    constructor(props) {
        super(props)
        setProps(this, props)
    }

    /** @var { String } геттер первой найденной ошибки. */
    get error() {
        return this.errors.find(error => error !== null) || null
    }

    /**
     * Валидация поля в зависимости от типа.
     * @param { any } value значение
     */
    isValid(value) {
        this.errors = []
        for (let key in this.fields) {
            this.fields[key].isValid(value)
            this.errors.push(this.fields[key].error)
        }
        if (this.type === 'anyOf') return this._anyOfValidate()
        if (this.type === 'allOf') return this._allOfValidate()
        if (this.type === 'oneOf') return this._oneOfValidate()
        return true
    }

    _anyOfValidate() {
        return this.errors.some(error => error === null)
    }

    _allOfValidate() {
        return this.errors.every(error => error === null)
    }

    _oneOfValidate() {
        const count = this.errors.filter(error => error === null).length
        if (count > 1) {
            this.errors.unshift('Ошибка oneOf')
            return false
        }
        return count === 1 ? true : false
    }


    /**
     * Конвертация типа значения.
     * @param { any } value значение
     * @returns { any } значение
     */
    convertType(value) {
        for (let key in this.fields) {
            if (this.fields[key].isValid(value)) {
                return this.fields[key].convertTypeWithDefault(value)
            }
        }
        return value
    }
    convertTypeWithDefault(value) {
        return this.convertType(value)
    }
}
