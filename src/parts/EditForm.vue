<template>
    <form>
        <fieldset>
            <legend>{{ title }}</legend>
            <!-- <div> -->

            <div v-if="displayFields" class="fields">
                <FieldSetWithFields 
                    :data="data"
                    :displayFields="displayFields"
                    :model="model"
                    @changeValue="changeValue"
                />

                <!-- <div v-for="displayFields, key in displayBlocks" :key="key"> -->

                    <!-- <div v-for="fieldName in displayFields" :key="fieldName">
                        <select v-if="hasFieldOptions(fieldName)" v-model="data[fieldName]" @change="changeValue">
                            <option v-for="option, key in fieldOptions(fieldName)" 
                                :key="option" 
                                :value="Array.isArray(fieldOptions(fieldName)) ? option : key"
                            >{{ option }}</option>
                        </select>
                        <input v-else v-model="data[fieldName]" :placeholder="fieldName" @input="changeValue" />
                    </div> -->

                <!-- </div> -->
            </div>
            <div class="buttons">
                <button @click.prevent="save" type="submit" :disabled="!isDirty">{{ btnText }}</button>
                <button @click.prevent="rollbackChanges">{{ isDirty ? 'Cancel' : 'Close' }}</button>
            </div>
            <div class="errors">
                <div v-for="error,i in data.$errors" :key="i">
                    {{ error }}
                </div>
            </div>
            <!-- </div> -->
        </fieldset>
    </form>
</template>

<script>
import FieldSetWithFields from './FieldSetWithFields.vue'
// import FieldSetWithFieldNames from './FieldSetWithFieldNames.vue'

export default {
    props: {
        modelName: { type: String },
        entity: { type: Object, default: () => {} },
        title: { type: String },
        btnText: { type: String },
    },
    emits: ['saveCb', 'closeCb'],
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
    watch: {
        entity() {
            console.log('watch entity', this.entity)
            this.updateDisplayFields()
            // this.setData()
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
        // fieldOptions(fieldName) {
        //     return this.model.fieldOptions(fieldName)
        // },
        // hasFieldOptions(fieldName) {
        //     return Boolean(this.model?.field(fieldName)?.options)
        // },
        updateDisplayFields() {
            console.log('updateDisplayFields')
            // const group = this.data.$fieldNamesGroup(undefined)
            // const group = this.data.$fieldNamesGroup(null)
            // const group = this.data.$fieldNamesGroup()
            // const group = this.data.$fieldsGroup()
            // const group = this.data.$fieldNamesGroup('general')
            // const group = this.data.$fieldNamesGroup('general', 2)
            // const group = this.data.$fieldNamesGroup('general', 'name')
            // const group = this.data.$fieldNamesGroup('general', 2, 'create_time')
            // const group = this.data.$fieldNamesGroup('system')
            // const group = this.data.$fieldNamesGroup('system', 0)
            let group = this.data.$fieldsGroup()
            // console.warn('group', group)
            // const group = this.data.$fieldNamesGroup()

            // this.displayFields = group.items
            this.displayFields = group
            console.warn('group', group)
            // this.displayFields = this.data.$applyFieldsDisplayRules(
            //     this.data.$fieldNamesGroup([1])
            // )
            // console.error(this.data.$fieldNamesGroup([0]))
        },
        // changeValue(fieldName, value) {
        changeValue() {
            // console.log('EditForm.changeValue()', fieldName, value)
            // this.data[fieldName] = value
            this.updateDisplayFields()
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
        this.updateDisplayFields()
    },
    components: { FieldSetWithFields }
    // components: { FieldSetWithFieldNames }
}
</script>
