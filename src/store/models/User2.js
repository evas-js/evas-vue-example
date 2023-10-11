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
            type: 'string',
            role: 'string',
            tagAny: 'string',
            tagsAny: 'string',
            tagsArray: 'string',
            email: 'string',
            create_time: 'string'
        }
    }
    static setFieldGrouping() {
        // return [
        //     this.displayBlock([
        //         'name', 'email', 'create_time'
        //     ]),
        //     this.displayBlock([
        //         'type', 'role', 'tagAny', 'tagsAny', 'tagsArray'
        //     ]),
        // ]
        // return {
        //     'general': [
        //         'name', 'email', [
        //             'create_time'
        //         ],
        //     ],
        //     'other': ['type', 'role', 'tagAny', 'tagsAny', 'tagsArray'],
        // }
        return [
            this.displayGroup([
                'name', 
                'email', 
                this.displayGroup([
                    'create_time'
                ], 'asd').canHide(),
            ], 'general').canHide(),
            this.displayGroup([
                'type', 'role', 'tagAny', 'tagsAny', 'tagsArray'
            ], 'other').canHide(),
        ]
        // return this.tabs({
        //     'web': [],
        //     'mail': this.blocks([
        //         []
        //     ]),
        // })

        // |----------
        // | [input]
        // | [input]
        // |----------
        //  [input]
        //  [input]
        //  [input]
        // |----------
        // | [input]
        // | [input]
        // |----------

        // |----------
        // | [tabs]
        // |----------
        // | [input]
        // | [input]
        // |----------
    }

    // static setDisplayBlocks() {
    //     return [
    //         ['name', 'email', 'create_time',
    //         ['type', 'role', 'tagAny', 'tagsAny', 'tagsArray'],
    //     ]
    // }

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

