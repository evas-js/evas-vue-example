/**
 * Парсер полученных данных.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { EvasVue } from '../index.js'

export class FetchedDataParser {
    model

    get entityName() {
        return this.model.entityName
    }

    constructor(model) {
        this.model = model
    }

    parse(data) {
        return !data 
            ? [] 
            : this.parse$rows(data) || this.parse$data(data) || this.model.insertOrUpdate(data, true)
    }

    parse$rows (data) {
        if (Array.isArray(data.$rows)) {
            let sub = { rows: data.$rows, type: data.$type || this.entityName }
            if (![undefined, null].includes(data.$totalRows)) sub.totalRows = data.$totalRows
            return this.parse$dataSub(sub)
        }
        return null
    }

    parse$data (data) {
        if (Array.isArray(data.$data)) {
            return data.$data?.reduce((acc, sub) => {
                let rows = this.parse$dataSub(sub)
                return rows ? acc.concat(rows) : acc
            }, [])
        }
        return null
    }

    parse$dataSub (sub) {
        let type = sub.type || this.entityName
        let model = EvasVue.getModel(type)
        if (!model) {
            console.error(`Model ${type} not found`)
            return
        }
        if (![undefined, null].includes(sub.totalRows)) model.totalRows = sub.totalRows
        return model.insertOrUpdate(sub.rows, true)
    }
}
