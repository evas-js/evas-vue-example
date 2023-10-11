/**
 * Расширение модели поддержкой отображения полей.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { logger } from '../Log.js'
import { Model } from './Model.js'
import { FieldGroup } from '../Field/FieldGroup.js'

/**
 * Установка правил отображения полей модели.
 * @return Object
 */
Model.setDisplayRules = function () {
    return {}
}

Model.setFieldGrouping = function () {
    return {}
}

Model._fieldGrouping = null

Model.fieldGrouping = function () {
    if (!this._fieldGrouping) {
        this._fieldGrouping = new FieldGroup(
            this.buildFieldGrouping(this.setFieldGrouping() ?? {})
        )
        console.log("fieldGrouping builded\n-----")
        // this._fieldGrouping = this.buildFieldGrouping(this.setFieldGrouping() ?? {})
        // this._fieldGrouping = new FieldGroup(this.setFieldGrouping() ?? {})
    }
    return this._fieldGrouping
}

Model.buildFieldGrouping = function (grouping) {
    const result = {}
    const typeNumber = Array.isArray(grouping)
    Object.entries(grouping).forEach(([key, item]) => {
        // if ('string' === typeof item) {
        //     item = this.field(item)
        // } else 
        if (
            Array.isArray(item)
             || ('object' === typeof item && !(item instanceof FieldGroup))
        ) {
            item = new FieldGroup(item)
        }
        if (item instanceof FieldGroup) {
            item.items = this.buildFieldGrouping(item.items)
            item.name = typeNumber ? Number(key) : String(key)
            console.log(item)
        }
        result[key] = item
    })
    return result
}

Model.fieldGroup = function (names) {
// Model.fieldGroup = function () {
    // const grouping = this.fieldGrouping()
    // if (!names) return grouping.items
    // if (grouping )
    const grouping = this.fieldGrouping().next(names)
    console.log('fieldGroup', grouping)
    return grouping
    // return this.fieldGrouping()
}
Model.prototype.$fieldGroup = function (names) {
    return this.constructor.fieldGroup(names)
}

// Model.displayBlocks = function (blocks) {
//     if (Array.isArray(blocks)) {
//         blocks = blocks.map((block, i) => {
//             return this.setDisplayBlock(i, block)
//         })
//     } else if (blocks && 'object' === typeof blocks) {
//         blocks = Object.entries(blocks).map(([key, value]) => {
//             return this.setDisplayBlock(key, value)
//         })
//     }
// }

// Model.displayBlock = function (name, items) {
//     if (arguments.length < 2) {
//         items = name
//         name = 0
//     }
//     return new FieldBlock(name, items)
// }
Model.displayGroup = function (name, items) {
    if (arguments.length < 2) {
        items = name
        name = 0
    }
    return new FieldGroup(name, items)
}

/**
 * @var Правила переменного отображения полей
 */
Model.rulesForVariableDisplayOfFields = {}

Model._displayRules = null
Model._displayBlocks = null
Model._displayGroups = null

/**
 * Получение правил отображаемия поля или полей модели.
 * @param String|null имя поля
 * @return Object правила поля или полей
 */
Model.displayRules = function (group = null) {
    if (!this._displayRules) {
        const rules = this.setDisplayRules()
        // подтягиваем пропсы из полей
        Object.keys(rules).forEach(fieldName => {
            const field = this.field(fieldName)
            if (!field) {
                console.log(this.fields())
                console.error(`Field for displayRule with name "${fieldName}" does not exists`)
                delete rules[fieldName]
                return
            }
            let fieldRules = rules[fieldName]
            if (field?.options) {
                if ('string' === typeof fieldRules) {
                    fieldRules = { component: fieldRules }
                }
                if (!fieldRules.props) fieldRules.props = {}
                fieldRules.props.options = field.options
            }
            field.setDisplay(fieldRules)
        })
        this._displayRules = rules
    }
    return [null, undefined].includes(group) ? this._displayRules : this._displayRules[group]
}

/**
 * Получение имен полей с правилами отображением.
 * @return Array
 */
Model.fieldNamesInDisplayRules = function () {
    return Object.keys(this.displayRules())
}

/**
 * Применение правил отображение полей в зависимости от значения других полей.
 * @param String|Number|null отображаемая группа полей
 * @return Array поля доступные к отображению
 */
Model.prototype.$applyFieldsDisplayRules = function (fieldNames = null) {
    if (!fieldNames) fieldNames = this.constructor.rulesForVariableDisplayOfFields
    return Object.values(fieldNames).reduce((viewFields, fieldName) => {
        const rule = this.constructor.rulesForVariableDisplayOfFields?.[fieldName]
        if (rule) {
            if (Array.isArray(rule)) {
                const [parentFieldName, parentValue] = rule
                if (viewFields.includes(parentFieldName)) {
                    let expected = this?.[parentFieldName]
                    expected = this.$field(parentFieldName).convertTypeWithDefault(expected)
                    if (expected === parentValue) viewFields.push(fieldName)
                }
                // const isShow =
                //     viewFields.includes(parentFieldName) &&
                //     this?.[parentFieldName] === parentValue
                // if (isShow) viewFields.push(fieldName)
            } else if ('function' === typeof rule) {
                rule(this) && viewFields.push(fieldName)
            }
        } else {
            viewFields.push(fieldName)
        }
        return viewFields
    }, [])
}

/** @var String|Number|null отображаемая группа полей */
Model.prototype.$displayGroup = null

/**
 * Получение полей для отображения.
 * @param String|Number|null отображаемая группа полей
 * @return Array поля доступные к отображению
 */
Model.prototype.$displayFields = function (group = null) {
    return logger.methodCall(`${this.$entityName}{${this.$id}}.$displayFields`, arguments, () => {
        this.$displayGroup = group
        const displayFields = this.$applyFieldsDisplayRules(group)
        logger.keyValue('$displayFields', displayFields)
        return displayFields
    })
}

Model.prototype.$displayFieldsWithPrepare = function (cb = null, group = null) {
    return this.$displayFields(group).map(fieldName => {
        const fieldProps = {
            fieldName: fieldName,
            value: this[fieldName],
            view: this.$field(fieldName),
            isDirty: this.$isDirtyField(fieldName) || false,
        }
        return cb ? cb(fieldProps) : fieldProps
    })
}

// Model.prototype.$displayFieldsByBlocks = function (group = null) {
//     // 
// }


// /**
//  * Получение правила отображения поля или самого поля.
//  * @param String имя поля
//  * @return Object|Field
//  */
// Model.fieldView = function (name, part = null) {
//     return this.displayRules(part)[name] || this.field(name)
// }
// Model.prototype.$fieldView = function (name, part = null) {
//     return this.constructor.fieldView(name, part)
// }



// Model.prototype.$fieldsToDisplay = function (part = null) {
//     return this.$applyFieldsDisplayRules(part).map(fieldName => {
//         return {
//             key: fieldName,
//             value: this[fieldName],
//             view: this.$fieldView(fieldName) || 'string',
//             isDirtyField: this.$isDirtyField(fieldName) || false,
//             disabled: false,
//         }
//     })
// }

// Model.prototype.$fieldsToDisplay = function (part = null, cb = null) {
//     const rules = this.$applyFieldsDisplayRules(part)
//     return rules.map(fieldName => {
//         const fieldProps = {
//             fieldName: fieldName,
//             value: this[fieldName],
//             view: this.$fieldView(fieldName, part) || 'string',
//             isDirty: this.$isDirtyField(fieldName) || false,
//         }
//         return cb ? cb(fieldProps) : fieldProps
//     })
// }
