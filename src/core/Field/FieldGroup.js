/**
 * Группа полей.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { Field } from './Field.js'
import { VariableField } from './VariableField.js'

export class FieldGroup {
    name
    items = {}
    hidden = false
    _canHide = false
    errors
    constructor(items, name = null) {
        this.items = items
        this.name = name
    }

    // setItems(items) {
    //     Object.entries(grouping).forEach(([key, item]) => {
    //         if ('string' === typeof item) item = this.field(item)
    //         this._fieldGrouping[key] = item
    //     })
    // }
    canHide(value = true) {
        this._canHide = value
        return this
    }

    isValid(data) {
        if (this.hidden) return true
        this.errors = []
        Object.entries(this.items).forEach(([, item]) => {
            if (item instanceof Field || item instanceof VariableField) {
                if (!item.isValid(data[item.name])) {
                    this.errors.push(item.error)
                }
            } else if (item instanceof this) {
                if (!item.isValid(data)) {
                    this.errors = this.error.concat(item.errors)
                }
            }
        })
        return this.errors.length < 1 ? true : false
    }

    next(names, cb) {
        console.log('next', names, this)
        if (!names || !names.length) {
            if (cb) cb(this)
            return this.items
        }
        const next = names.shift()
        const group = Object.values(this.items).find(item => item.name == next)
        console.log(next, group)
        // return names.length ? group.next(names) : group
        if (cb) cb(group)
        return group ? group.next(names) : group
    }

    show(names) {
        return this.next(names, (group) => {
            if (group._canHide) group.hidden = false
        })
    }

    hide(names) {
        return this.next(names, (group) => {
            if (group._canHide) group.hidden = true
        })
    }

    toggle(names) {
        return this.hidden ? this.show(names) : this.hide(names)
    }
}

// export class FieldBlock {
//     name
//     items = []
//     parent
//     shown = true
//     errors = []

//     constructor(name, items, parent) {
//         this.name = name
//         this.items = items
//         this.parent = parent
//     }

//     isValid(data) {
//         if (false === this.shown) return true
//         this.errors = []
//         this.items.forEach(item => {
//             if (item instanceof Field || item instanceof VariableField) {
//                 if (!item.isValid(data[item.name])) {
//                     this.errors.push(item.error)
//                 } else if (item instanceof this) {
//                     if (!item.isValid(data)) {
//                         this.errors = this.error.concat(item.errors)
//                     }
//                 }
//             }
//         })
//         return this.errors.length < 1 ? true : false
//     }

//     shownChildGroup
//     shownableChildGroups() {
//         return this.items.filter(item => item instanceof FieldGroup)
//     }

//     show(names) {
//         if (!names) {
//             return this.items
//         }
//         const next = names.shift()
//         const group = this.items.find(item => item.name == next)
//         if (group !== undefined) {
//             return []
//         }
//         return group.show()
//     }

//     getShownWithFields() {
//         const items = this.items.filter(
//             item => !(item instanceof FieldBlock) || item.shown == true
//         )
//         return items.map(item => {
//             if (item instanceof FieldBlock) {
//                 item.getShownWithFields()
//             }
//         })
//     }
// }

// export class FieldGroup {    
//     shown = false
    
//     show(names) {
//         super.show(names)
//         this.parent.shownChildGroup?.hide()
//         this.shown = true
//         this.parent.shownChildGroup = this
//         return this
//     }

//     hide() {
//         this.shown = false
//         return this
//     }

//     toggle() {
//         this.shown = this.shown ? this.hide() : this.show()
//         return this
//     }
// }
