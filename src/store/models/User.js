// import { Model } from '@/core/Model/Model.js'
import { Model } from '@/core/index.js'

export class User extends Model {
    static routes = {
        insert: 'user.insert',
        update: 'user.update',
        delete: 'user.delete',
        list: 'user.list',
    }
    
    static setFields() {
        return {
            id: this.number().nullable(),
            name: this.string('John Doe').min(3).max(10),
            // email: this.string('john_doe@example.com').pattern(/^.{2,}@.{2,}\..{2,}$/).nullable(),
            // create_time: this.string(() => (new Date).toString()).nullable(),
            type: this.number().options({1: 'admin', 2: 'sale', 3: 'dev'}).nullable(),
            role: this.string().options('admin', 'sale', 'front', 'back').nullable(),
            // tags: this.array(this.string().pattern(/^\d+$/)).nullable(),
            tagAny: this.anyOf([
                this.string().pattern(/^\d+$/),
                this.string().pattern(/^[a-z]+$/)
            ]),
            tagsAny: this.array(
                this.anyOf([
                    this.number().pattern(/^\d+$/),
                    this.string().pattern(/^[a-z]+$/)
                ])
            ).nullable(false),
            tagsArray: this.array(
                this.string().pattern(/^\d+$/)
            ).required(true),
            // referer_id: this.number().nullable(),
        }
    }

    static setRelations() {
        return {
            referer: this.belongsTo(User, 'referer_id'),
            referals: this.hasMany(User, 'id', 'referer_id'),
        }
    }

    static alwaysSend = [ 'referer_id' ]

    static rulesForVariableDisplayOfFields = {
        // tagsArray: [ 'tagAny', '123' ],
        // tagsArray: [ 'name', 'John Doe' ],
        tagsArray: [ 'type', 'admin' ],
    }

    static setDisplayRules() {
        return {
            name: 'string',
            type: 'string',
            role: 'string',
            tagAny: 'string',
            tagsAny: 'string',
            tagsArray: 'string',
            email: 'string',
            create_time: 'string'
        }
    }
}
