<template>
    <div v-if="displayFields.items" class="fieldset">
        <template v-for="field in realDisplayFields" :key="field.name">
            <template v-if="isFieldGroup(field)">
                <span v-if="isTab(field)" class="tabName" :class="{selected: isSelected(field)}" @click="selectTab(field)">
                    {{ field.name }}
                </span>
                <FieldSetWithFields v-if="isSelected(field)"
                    :data="data"
                    :displayFields="field"
                    :model="model"
                    @changeValue="changeValue"
                />
            </template>
            <div v-else class="field">
                <span class="label">{{ field.name }}</span>
                <select v-if="hasFieldOptions(field)" v-model="local[field.name]" @change="changeValue">
                    <option v-for="option, key in fieldOptions(field)" 
                        :key="option" 
                        :value="Array.isArray(fieldOptions(field)) ? option : key"
                    >{{ option }}</option>
                </select>
                <input v-else v-model="local[field.name]" :placeholder="field.name" @input="changeValue" />
            </div>
        </template>
    </div>
</template>

<script>
import { Group, Tab } from '@/core/index.js'

// @change="changeValue(fieldName, $event)"
export default {
    props: {
        data: { type: Object, required: true },
        displayFields: { type: [Array, Object], default: () => [] },
        model: { type: Function, required: true },
    },
    emits: ['changeValue'],
    data() {
        return {
            realDisplayFields: [],
            local: null
        }
    },
    watch: {
        data() {
            this.local = this.data
        },
    },
    methods: {
        fieldOptions(field) {
            return this.model.fieldOptions(field.name)
        },
        hasFieldOptions(field) {
            // console.log(fieldName, this.model?.field(fieldName))
            // return Boolean(this.model?.field(fieldName)?.display?.component === 'select')
            // return Boolean(this.model?.field(field.name)?.options)
            return Boolean(field?.options)
        },
        
        // changeValue(fieldName, e) {
        //     console.log(fieldName, e.target.value)
        //     this.$emit('changeValue', fieldName, e.target.value)
        // },
        changeValue() {
            this.$emit('changeValue')
            this.updateDisplayFields()
        },
        updateDisplayFields() {
            // this.realDisplayFields = this.displayFields
            // this.realDisplayFields = this.data.$applyFieldsDisplayRules(
            //     this.displayFields
            // )
            console.log('this.displayFields.names', this.displayFields.names)
            // this.realDisplayFields = this.displayFields
            const names = this.data.$applyFieldsDisplayRules(
                this.displayFields.names
            )
            console.log('names', names)
            this.realDisplayFields = Object.values(this.displayFields.items).filter(item => item instanceof Group || names.includes(item.name))
            console.log('this.realDisplayFields', this.realDisplayFields)
        },

        isFieldGroup(field) {
            return field instanceof Group
        },
        isTab(field) {
            return field instanceof Tab
        },

        isSelected(group) {
            return !(group instanceof Tab) || group.selected
        },

        selectTab(group) {
            // group.select()
            this.data.$selectGroup(group)
        },
    },
    created() {
        this.local = this.data
        this.updateDisplayFields()
        console.log(this.realDisplayFields)
    }
}
</script>
