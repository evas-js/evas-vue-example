<template>
    <form>
        <fieldset>
            <legend>{{ title }}</legend>
            <div>
                <!-- <input v-model="data.$id" placeholder="id" disabled>
                <input v-model="data.name" placeholder="name"> -->

                <!-- <input v-model="data.email" placeholder="email"> -->
                <!-- <input v-model.number="data.referer_id" placeholder="referer_id"> -->
               <!--  <select v-model="data.type">
                    <option disabled>Select type</option>
                    <option v-for="option, key in typeOptions" :key="key" :value="key">
                        {{ option }}
                    </option>
                </select> -->
                <!-- <select v-model="data.role">
                    <option disabled>Select role</option>
                    <option v-for="option, key in roleOptions" :key="key" :value="key">
                        {{ option }}
                    </option>
                </select> -->

                <!-- <input v-model="data.tagAny" placeholder="tagAny">
                <input v-model="data.tagsAny" placeholder="tagsAny">
                <input v-model="data.tagsArray" placeholder="tagsArray"> -->

                <!-- <div v-for="displayFields, key in displayBlocks" :key="key"> -->

                    <div v-for="fieldName in displayFields" :key="fieldName">
                        <select v-if="hasFieldOptions(fieldName)" v-model="data[fieldName]" @change="changeValue">
                            <option v-for="option in fieldOptions(fieldName)" :key="option">{{ option }}</option>
                        </select>
                        <input v-else v-model="data[fieldName]" :placeholder="fieldName" @input="changeValue" />
                    </div>

                <!-- </div> -->

                <div class="buttons">
                    <button @click.prevent="save" type="submit" :disabled="!isDirty">{{ btnText }}</button>
                    <button @click.prevent="rollbackChanges">{{ isDirty ? 'Cancel' : 'Close' }}</button>
                </div>
                <div class="errors">
                    <div v-for="error,i in data.$errors" :key="i">
                        {{ error }}
                    </div>
                </div>
            </div>
        </fieldset>
    </form>
</template>

<script>
export default {
    props: {
        modelName: { type: String },
        entity: { type: Object, default: () => {} },
        title: { type: String },
        btnText: { type: String },
    },
    emits: ['saveCb', 'closeCb'],
    watch: {
        entity() {
            console.log('watch entity', this.entity)
            // this.setData()
        },
    },
    data() {
        return {
            // data: {}
            displayFields: {},
            displayBlocks: [],
        }
    },
    computed: {
        model() {
            return this.$models[this.modelName]
        },
        // typeOptions() {
        //     if (!this.model) return []
        //     let options = this.model.fieldOptions('type')
        //     // options[options.length] = 'incorrect'
        //     return options
        // },
        // roleOptions() {
        //     if (!this.model) return []
        //     let options = this.model.fieldOptions('role')
        //     // options['incorrect'] = 'incorrect'
        //     return options
        // },
        isDirty() {
            return this.entity ? this.entity.$isDirty : true
        },
        data() {
            return this.entity || new this.model
        },
    },
    methods: {
        // setData() {
        //     this.data = this.entity || {
        //         name: null,
        //         email: null,
        //         referer_id: null,
        //         type: null,
        //     }
        // },
        fieldOptions(fieldName) {
            return this.model.fieldOptions(fieldName)
        },
        hasFieldOptions(fieldName) {
            return Boolean(this.model?.field(fieldName)?.options)
        },

        changeValue() {
            this.displayFields = this.data.$displayFields()
        },
        split(fieldName) {
            let value = this?.data?.[fieldName]
            if ('string' === typeof value) {
                value = value.split(',')
                if (value.length < 1 || !value[0]) {
                    value = null
                } else {
                    value = value.map(sub => String(sub).trim())
                }
                this.data[fieldName] = value
            }
        },
        save() {
            this.split('tagsAny')
            this.split('tagsArray')
            this.$emit('saveCb', this.data)
        },
        rollbackChanges() {
            // if (this.entity) {
            //     this.entity.$rollbackChanges()
            //     this.entity.$clearErrors()
            // }
            if (this.data) {
                this.data.$rollbackChanges()
                this.data.$clearErrors()
            }
            this.$emit('closeCb')
        },
    },
    created() {
        // this.setData()

        // this.displayFields = this.data.$applyFieldsDisplayRules()
        this.changeValue()
    },
}
</script>
