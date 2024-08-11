/**
 * Расширение модели поддержкой CRUD-методов.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { Model } from './Model.js'

Model._processInsert = function (entity, afterFetch = false) {
    // call api insert
    if (this.useApi && false === afterFetch) {
        this.fetchInsert(entity.$dirtyData)
    }
}

Model._processUpdate = function (entity, afterFetch = false) {
    this.map.set(entity.$id, entity)
    // call api update
    if (this.useApi && false === afterFetch) {
        this.fetchUpdate({ id: this.$id, ...entity.$dirtyData })
    }
}
Model._processInsertOrUpdate = function (entity, afterFetch = false) {
    if (entity.$id) this._processUpdate(entity, afterFetch)
    else this._processInsert(entity, afterFetch)
}

Model.mutationHelper = function (selfCbName, checkIdCb, processCb, entity, afterFetch = false) {
    if (Array.isArray(entity)) {
        return entity.map((_entity) => this[selfCbName](_entity, afterFetch))
    } else if (entity && entity instanceof this) {
        if (checkIdCb) checkIdCb(entity)
        if (processCb) this[processCb](entity, afterFetch)
        if (afterFetch) entity.$saveState()
        return entity
    } else if (entity && 'object' === typeof entity) {
        return new this(entity, selfCbName === 'insertOrUpdate' ? afterFetch : !afterFetch)
    }
}

/**
 * Вставка или обновление записи.
 * @param Model|object запись или данные записи
 * @param Boolean|null это данные после api запроса?
 * @return Model запись
 */
Model.insertOrUpdate = function (entity, afterFetch = false) {
    // if (Array.isArray(entity)) {
    //     return entity.map((_entity) => this.insertOrUpdate(_entity, afterFetch))
    // } else if (entity && entity instanceof this) {
    //     if (entity.$id) this._processUpdate(entity, afterFetch)
    //     else this._processInsert(entity, afterFetch)

    //     if (afterFetch) entity.$saveState()
    //     return entity
    // } else if (entity && 'object' === typeof entity) {
    //     return new this(entity, afterFetch)
    // }
    return this.mutationHelper(
        'insertOrUpdate', 
        null, 
        '_processInsertOrUpdate',
        entity, afterFetch
    )
}

/**
 * Вставка записи.
 * @param { Model|Object } entity запись или данные записи
 * @param { Boolean|null } afterFetch это данные после api запроса?
 * @returns { Model } запись
 */
Model.insert = function (entity, afterFetch = false) {
    // if (Array.isArray(entity)) {
    //     return entity.map((_entity) => this.insert(_entity, afterFetch))
    // } else if (entity && entity instanceof this) {
    //     if (entity.$id) throw new Error('Empty entity has $id')
    //     this._processInsert(entity, afterFetch)

    //     if (afterFetch) entity.$saveState()
    //     return entity
    // } else if (entity && 'object' === typeof entity) {
    //     return new this(entity, !afterFetch)
    // }
    return this.mutationHelper(
        'insert', 
        (entity) => {
            if (entity.$id) throw new Error('Empty entity has $id')
        }, 
        '_processInsert', 
        entity, afterFetch
    )
}

/**
 * Обновление записи.
 * @param { Model|Object} entity запись или данные записи
 * @param { Boolean|null } afterFetch это данные после api запроса?
 * @returns { Model } запись
 */
Model.update = function (entity, afterFetch = false) {
    // if (Array.isArray(entity)) {
    //     return entity.map((_entity) => this.update(_entity, afterFetch))
    // } else if (entity && entity instanceof this) {
    //     if (!entity.$id) throw new Error('Entity not has $id')
    //     this._processUpdate(entity, afterFetch)

    //     if (afterFetch) entity.$saveState()
    //     return entity
    // } else if (entity && 'object' === typeof entity) {
    //     return new this(entity, !afterFetch)
    // }
    return this.mutationHelper(
        'update', 
        (entity) => {
            if (!entity.$id) throw new Error('Entity not has $id')
        }, 
        '_processUpdate', 
        entity, afterFetch
    )
}

/**
 * Удаление записи.
 * @param { Model|Object|Number } entity запись или данные записи или id записи
 * @param { Function } cb колбэк после удаления
 * @param { Boolean|null } afterFetch это данные после api запроса?
 * @returns { Model } запись
 */
Model.delete = function (entity, cb, afterFetch = false) {
    if (Array.isArray(entity)) {
        entity.forEach((_entity) => this.delete(_entity, afterFetch))
    }
    if (entity && entity instanceof this) {
        return this.delete(entity.$id, cb, afterFetch)
    }
    if (entity && 'object' === typeof entity) {
        return (new this(entity)).$delete()
    }
    if (entity && ('number' === typeof entity || 'string' === typeof entity)) {
        this.map.delete(entity)
        if (this.useApi && false === afterFetch) {
            // call api delete
            this.fetchDelete({ id: entity }, cb)
        }
    }
}


// instance mutations

/**
 * Получение данных для сохранения.
 * @returns { Object } $dirtyData + alwaysSend
 */
Object.defineProperty(Model.prototype, '$dataToSave', {
    get: function () {
        let data = { ...this.$dirtyData }
        if (Array.isArray(this.constructor.alwaysSend)) {
            let alwaysSendData = {}
            this.constructor.alwaysSend.forEach(key => alwaysSendData[key] = this[key])
            data = { ...alwaysSendData, ...data }
        }
        if (!this.$isNew) data[this.constructor.primary] = this.$id
        return data
    }
})

/**
 * Сохранение записи.
 * @param { Function } cb колбэк после сохранения
 */
Model.prototype.$save = function (cb) {
    console.log(`${this.$entityNameWithId}.$save`)
    if (!this.$isDirty) {
        console.log('Nothing to save. End save')
        return 
    }

    if (this.$isNew) {
        this.$beforeInsert()
        if (this.$validate()) {
            if (this.constructor.useApi) this.constructor.fetchInsert(this.$dataToSave, cb)
            else this.$saveState()
            console.log('Inserted')
            this.$afterInsert()
        }
    } else {
        this.$beforeUpdate()
        if (this.$validate()) {
            if (this.constructor.useApi) this.constructor.fetchUpdate(this.$dataToSave, cb)
            else this.$saveState()
            console.log('Updated')
            this.$afterUpdate()
        }
    }
    console.log('End save')
}

/**
 * Удаление записи.
 * @param { Function } cb колбэк после удаления
 */
Model.prototype.$delete = function (cb) {
    console.log(`${this.$entityNameWithId}.$delete`)
    this.$beforeDelete()
    if (this.constructor.useApi) this.constructor.delete(this, cb)
    else this.$saveState()
    this.$afterDelete()
}

// instance mutation hooks
Model.prototype.$beforeInsert = function () {}
Model.prototype.$afterInsert = function () {}
Model.prototype.$beforeUpdate = function () {}
Model.prototype.$afterUpdate = function () {}
Model.prototype.$beforeDelete = function () {}
Model.prototype.$afterDelete = function () {}
