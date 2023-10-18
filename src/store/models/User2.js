// import { Model } from '@/core/Model/Model.js'
import { Model } from '@/core/index.js'

export class User2 extends Model {
    static routes = {
        insert: 'user2.insert',
        update: 'user2.update',
        delete: 'user2.delete',
        list: 'user2.list',
    }
    
    static setFields() {
        return {
            id: this.number().nullable(),
            name: this.string('John Doe').min(3).max(10),
            email: this.string('john_doe@example.com').pattern(/^.{2,}@.{2,}\..{2,}$/).required(),
            // create_time: this.string(() => (new Date).toString()).nullable(),
            type: this.number().options({1: 'admin', 2: 'sale', 3: 'dev'}).nullable(),
            role: this.string().options('admin', 'sale', 'front', 'back').nullable(),
            // tags: this.array(this.string().pattern(/^\d+$/)).nullable(),
            tagAny: this.anyOf([
                this.string().pattern(/^\d+$/),
                this.string().pattern(/^[a-z]+$/)
            ]).required(),
            tagsAny: this.array(
                this.anyOf([
                    this.number().pattern(/^\d+$/),
                    this.string().pattern(/^[a-z]+$/)
                ])
            ).required(),
            tagsArray: this.array(
                this.string().pattern(/^\d+$/)
            ).required(),
            // referer_id: this.number().nullable(),
        }
    }

    static setRelations() {
        return {
            referer: this.belongsTo(User2, 'referer_id'),
            referals: this.hasMany(User2, 'id', 'referer_id'),
        }
    }

    static alwaysSend = [ 'referer_id' ]

    static rulesForVariableDisplayOfFields = {
        // tagsArray: [ 'tagAny', '123' ],
        // tagsArray: [ 'name', 'John Doe' ],
        tagAny: [ 'type', 1 ],
        tagsAny: [ 'type', 1 ],
        tagsArray: [ 'role', 'admin' ],
    }

    static setDisplayRules() {
        return {
            name: 'string',
            email: 'string',
            type: 'select',
            role: 'select',
            tagAny: 'string',
            tagsAny: 'string',
            tagsArray: 'string',
            create_time: 'string'
        }
    }
    static setFieldGrouping() {
        return this.tabs({
            'general': [
                'name', 'email',
                // this.block(['create_time'])
                ['create_time'],
            ],
            'system': [
                // this.block(['type', 'role']),
                ['type', 'tagAny', 'tagsAny'],
                'role', 'tagsArray',
            ]
        })
    }

    $beforeFieldGroup(names) {
            console.error('$beforeFieldGroup', names)
        // const fieldNames = this.$displayFields(this.$displayGroup)
        if (![undefined, null].includes(this.$displayGroupName) 
            && this.$displayGroupName !== names) {
            const fieldNames = this.$displayFields()
            console.log('fieldNames', fieldNames)
            // this.$clearFields(fieldNames)
        }
    }
}
