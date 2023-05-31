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
}
