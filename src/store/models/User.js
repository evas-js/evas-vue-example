// import { Model } from 'evas-vue/Model'
// import { Model } from 'evas-vue/Model.js'
import { Model } from 'evas-vue'

export class User extends Model
{
    static routes = {
        'insert': 'user.insert',
        'update': 'user.update',
        'delete': 'user.delete',
        'list': 'user.list',
        'one': 'user.one',
    }

    static fields() {
        return {
            id: this.number().nullable(),
            name: this.string('John Doe').min(3).max(10),
            email: this.string('john_doe@example.com').nullable(),
            create_time: this.string(() => (new Date).toString()).nullable(),
            referer_id: this.number().nullable(),
        }
    }

    static relations() {
        return {
            referer: this.belongsTo(User, 'referer_id'),
            referals: this.hasMany(User, 'id', 'referer_id'),
        }
    }



    // Model.js

    // static validateErrorHandlers = {}
    // static defaultValidateErrorHandler = null

    // static setDefaultValidateErrorHandler(cb) {
    //     if ('function' !== typeof cb) throw new Error(
    //         `default validate error handler must be a function, ${typeof cb} given`
    //     )
    //     this.defaultValidateErrorHandler = cb
    //     return this
    // }

    // static addValidateErrorHandler(fieldName, cb) {
    //     if (!['string', 'number'].includes(typeof fieldName)) throw new Error(
    //         `validate error handler field name must a string, ${typeof fieldName} given`
    //     )
    //     if ('function' !== typeof cb) throw new Error(
    //         `validate error handler for field "${fieldName}" must be a function, ${typeof cb} given`
    //     )
    //     this.validateErrorHandlers[fieldName] = cb
    //     return this
    // }

    // static handleValidateError(field, error) {
    //     if (this.validateErrorHandlers[field._name]) {
    //         this.validateErrorHandlers[field._name](error)
    //     } else if (this.defaultValidateErrorHandler) {
    //         this.defaultValidateErrorHandler(error, field._name)
    //     } else {
    //         console.error(field, error)
    //     }
    // }
}

// // Component

// // this.model.addValidateErrorHandler('email', asd)
// this.model.setDefaultValidateErrorHandler((error, fieldName) => {
//     // 
// })

