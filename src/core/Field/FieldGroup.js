/**
 * Группа полей.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

export class FieldBlock {
    items = []
    tabbable = false

    constructor(items) {
        this.items = items
    }
}

export class FieldGroup {    
    tabbable = true
    visible = false
    
    show() {
        this.visible = true
        return this
    }

    hide() {
        this.visible = false
        return this
    }

    toggle() {
        this.visible = !this.visible
        return this
    }
}
