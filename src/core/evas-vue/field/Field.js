/**
 * Поле.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

// import { FieldBuilder } from './FieldBuilder.js'
import { Fieldable } from './Fieldable.js'
import { setProps } from './FieldableBuilder.js'

export class Field extends Fieldable {
    /** @var { String } тип */
    type
    /** @var { Number } минимальное значение или длина */
    min = 0
    /** @var { Number } максимальное значение или длина */
    max
    /** @var { String } паттерн значения */
    pattern
    /** @var { Object }|Array опции значения */
    options
    /** @var { String } имя совпадающего поля */
    same
    /** @var { String } лейбл совпадающего поля */
    sameLabel
    /** @var { any } значение по умолчанию */
    default
    /** @var { any } значение */
    value
    /** @var { String } ошибка валидации */
    error

    itemOf

    /** Геттер лейбла или имени совпадающего поля. */
    get sameLabelOrName() { return this.sameLabel || this.same }

    /**
     * Геттер строкового типа поля.
     * @returns { Boolean }
     */
    get isStringType() {
        return 'string' === this.type
    }

    /**
     * Геттер числового типа поля.
     * @returns { Boolean }
     */
    get isNumberType() {
        return ['number', 'int', 'integer', 'float'].includes(this.type)
    }

    /**
     * Геттер булевого типа поля.
     * @returns { Boolean }
     */
    get isBooleanType() {
        return  ['bool', 'boolean'].includes(this.type)
    }

    /**
     * Геттер массива типа поля.
     * @returns { Boolean }
     */
    get isArrayType() {
        return 'array' === this.type;
    }

    /**
     * @param { Object|null } props свойства поля
     */
    constructor(props) {
        super(props)
        setProps(this, props)
    }

    /**
     * Получение значения по умолчанию.
     * @returns { any }
     */
    getDefault() {
        return 'function' === typeof this.default ? this.default() : this.default
    }

    /**
     * Конвертация типа значения.
     * @param { any } value значение
     * @returns { any } значение
     */
    convertType(value) {
        if (!this.required && this.isEmptyValue(value)) return value
        if (this.isArrayType) return Array.isArray(value) ? Array.from(value) : value;
        if (this.isStringType) return value == null ? '' : String(value)
        if (this.isNumberType) {
            let newValue = Number(value)
            return isNaN(newValue) ? value : newValue
        }
        if (this.isBooleanType) return Boolean(value)
        // throw new Error(`Field "${this._name}" has unknown type: ${this._type}`)
        return value;
    }

    /**
     * Подучение значения конвертированного типа или дефолтного значения.
     * @param { any } value значение
     * @returns { any } значение
     */
    convertTypeWithDefault(value) {
        // return this.convertType(value !== undefined ? value : this.getDefault())
        // return this.convertType(![undefined, null].includes(value) ? value : this.getDefault())
        return [undefined, null].includes(value) ? this.getDefault() : this.convertType(value)
    }
}

// раширение поля поддержкой валидации
require('./Field.validate.js')
