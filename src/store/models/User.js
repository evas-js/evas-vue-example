import { Model } from "@/core/evas-vue";

export class User extends Model {
    static routes = {
        // 'list': 'User.list',
        prefix: '/users',
        actions: ['list', 'one', 'update', 'insert', 'delete', 'download']
    }

    static primary = 'id'

    static setFields() {
        return {
            id: this.string(),
            name: this.string(),
        }
    }
}
