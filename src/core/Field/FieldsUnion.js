export class FieldsUnion {
    type
    fields
    _required
    errors = []

    constructor(type, fields) {
        this.type = type
        this.fields = fields
    }

    required(value) {
        this._required = value
        return this
    }

    get error() {
        return this.errors.find(error => error !== null) || null
    }

    /**
     * Валидация поля в зависимости от типа.
     * @param value значение
     */
    isValid(value) {
        this.errors = []
        for (let key in this.fields) {
            this.fields[key].isValid(value)
            this.errors.push(this.fields[key].error)
        }
        let res = true
        if (this.type === 'anyOf') res = this._anyOfValidate()
        if (this.type === 'allOf') res = this._allOfValidate()
        if (this.type === 'oneOf') res = this._oneOfValidate()
        console.log('FieldsUnion.isValid', this.errors, res)
        return res
    }

    _anyOfValidate() {
        // return this.errors.includes(null) ? null : this.errors[0]
        return this.errors.some(error => error === null)
    }

    _allOfValidate() {
        return this.errors.every(error => error === null)
        // return this.errors.find(error => error !== null) || null
    }

    _oneOfValidate() {
        const count = this.errors.filter(error => error === null).length
        if (count > 1) return 'Ошибка oneOf'
        if (count === 0) return this.errors[0]
    }
}
