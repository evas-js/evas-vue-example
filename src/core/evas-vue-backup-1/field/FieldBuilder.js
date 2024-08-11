/**
 * Сборщик поля.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */
import { setProps, FieldableBuilder } from './FieldableBuilder.js'

export class FieldBuilder extends FieldableBuilder {
    /** @var { String } имя поля */
    _name
    /** @var { String } лейбл поля */
    _label
    /** @var { String } тип */
    _type
    /** @var { Number } минимальное значение или длина */
    _min
    /** @var { Number } максимальное значение или длина */
    _max
    /** @var { String } паттерн значения */
    _pattern
    /** @var { Object|Array } опции значения */
    _options
    /** @var { String } имя совпадающего поля */
    _same
    /** @var { String } лейбл совпадающего поля */
    _sameLabel

    _itemOf

    /**
     * @param { Object|null } props свойства поля
     */
    constructor(props) {
        super(props)
        setProps(this, props)
    }

    name(value) {
        this._name = value
        return this
    }
    label(value) {
        this._label = value
        return this
    }
    type(value) {
        this._type = value
        return this
    }
    min(value) {
        this._min = value
        return this
    }
    max(value) {
        this._max = value
        return this
    }
    pattern(value) {
        this._pattern = value
        return this
    }
    options(value) {
        if (!value) {
            return console.error('Options not setting')
        }
        if (['string', 'number'].includes(typeof value)) {
            value = arguments
        }
        if (!(Array.isArray(value) || 'object' === typeof value)) {
            return console.error(
                `Options of the field ${this._name} must be an array or an object,`,
                `${typeof value} given`, 
                value
            )
        }
        if (Object.prototype.toString.call(value) === '[object Arguments]') {
            value = Array.from(value)
        }
        this._options = value
        return this
    }
    same(value, label) {
        this._same = value
        if (label) this.sameLabel(label)
        return this
    }
    sameLabel(value) {
        this._sameLabel = value
        return this
    }
}
