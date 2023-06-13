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
            email: this.string('john_doe@example.com').pattern(/^.{2,}@.{2,}\..{2,}$/).nullable(),
            create_time: this.string(() => (new Date).toString()).nullable(),
            type: this.number().options({1: 'admin', 2: 'sale', 3: 'dev'}).nullable(),
            role: this.string().options('admin', 'sale', 'front', 'back').nullable(),
            referer_id: this.number().nullable(),
        }
    }

    static setRelations() {
        return {
            referer: this.belongsTo(User, 'referer_id'),
            referals: this.hasMany(User, 'id', 'referer_id'),
        }
    }

    static alwaysSend = [ 'referer_id' ]

    static setView() {
        return {
            name: 'string',
            email: 'string',
            create_time: 'string'
        }
    }
}
