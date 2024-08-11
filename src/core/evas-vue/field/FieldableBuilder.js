/**
 * Базовый класс для сборщика поля и сборщика вариативного поля.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

export class FieldableBuilder {
    /** @var { Boolean } обязательность значения */
    _required = true
    /** @var { any } значение по умолчанию */
    _default
    /** @var { String|Object } информация о способе отображения поля */
    _display

    /**
     * Установка поля обязательным.
     * @param { Boolean|true } value установить обязательным
     * @returns { this }
     */
    required(value = true) {
        this._required = value
        return this
    }
    /**
     * Установка поля необязательным.
     * @param { Boolean|true } value установить необязательным
     * @returns { this }
     */
    nullable(value = true) {
        this._required = !value
        return this
    }

    /**
     * Установка значения по умолчанию.
     * @param { any } value значение по умолчанию
     * @returns { this }
     */
    default(value) {
        this._default = value
        return this
    }

    /**
     * Установка информации о способе отображения поля.
     * @param { any } value информации о способе отображения поля
     * @returns { this }
     */
    display(value) {
        this._display = value
        return this
    }


    /**
     * Экспорт свойств для поля/вариативного поля.
     * @returns { Object }
     */
    export() {
        let data = {}
        Object.entries(this).forEach(([key, value]) => {
            key = key.substring(1)
            data[key] = value
        })
        return data
    }
}

/**
 * Установка свойств для конструктора.
 * @param { Object } ctx контекст
 * @param { Object|null } props свойства поля
 */
export function setProps(ctx, props) {
    if (props) {
        if (props instanceof FieldableBuilder) {
            props = props.export()
        }
        if ('object' === typeof props && !Array.isArray(props)) for (let key in props) {
            ctx[key] = props[key]
        }
        else {
            console.error(
                'Field props must be an object or an instanceof FieldableBuilder,',
                `${typeof props} given`,
                props
            )
        }
    }
}
