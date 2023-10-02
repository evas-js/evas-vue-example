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
            referer: this.belongsTo(User2, 'referer_id'),
            referals: this.hasMany(User2, 'id', 'referer_id'),
        }
    }

    static alwaysSend = [ 'referer_id' ]

    static rulesForVariableDisplayOfFields = {
        // tagsArray: [ 'tagAny', '123' ],
        // tagsArray: [ 'name', 'John Doe' ],
        tagAny: [ 'type', 'admin' ],
        tagsAny: [ 'type', 'admin' ],
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

    static setDisplayBlocks() {
        return []
    }

    // ..... Model .....

    static displayGroupRules(groups) {
        return new Groups(groups)
    }

    static displayBlockRules(blocks) {
        return new Blocks(blocks)
    }

    // static displayRules() {
    //     const rules = this.setDisplayRules()
    //     if (rules instanceof Blocks) {
    //         // 
    //     }
    // }
}

class Groups {
    groups
    constructor(groups) {
        if (Array.isArray(groups)) {
            groups.forEach((value, key) => this.addGroup(key, value))
        } 
        else if ('object' === typeof groups) {
            Object.entries(groups).forEach(([key, value]) => this.addGroup(key, value))
        }
    }
    addGroup(key, value) {
        if (value instanceof Blocks) {
            value.setGroupIndex(key)
        }
        this.groups[key] = value
    }
}

class Blocks {
    groupIndex
    blocks
    constructor(blocks) {
        this.blocks = blocks 
    }
    setGroupIndex(groupIndex) {
        this.groupIndex = groupIndex
    }
}

