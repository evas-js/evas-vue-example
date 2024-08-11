/**
 * Расширение модели поддержкой запросов к хранилищу.
 * @package evas-vue
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { Model } from './Model.js'
import { Query } from "./Query.js"

Model.query = function () {
    return new Query(this)
}
Model.find = function (id) {
    const query = this.query()
    if (arguments.length > 1 && !Array.isArray(id)) id = Array.from(arguments)
    const field = this.field(this.primary)
    if (Array.isArray(id)) id = id.map(sub => field.convertType(sub))
    else id = field.convertType(id)
    return Array.isArray(id)
        ? query.whereIn(this.primary, id).get()
        : query.where(this.primary, id).first()
}
