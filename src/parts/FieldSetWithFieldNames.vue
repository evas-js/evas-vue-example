<template>
    <div v-if="displayFields.names" class="fieldset">
        <template v-for="fieldName in realDisplayFields" :key="fieldName">
            <template v-if="isFieldGroup(fieldName)">
                <span v-if="isTab(fieldName)" class="tabName" :class="{selected: isSelected(fieldName)}" @click="selectTab(fieldName)">
                    {{ fieldName.name }}
                </span>
                <!-- {{ fieldName }} -->
                <FieldSetWithFieldNames v-if="isSelected(fieldName)"
                    :data="data"
                    :displayFields="fieldName"
                    :model="model"
                    @changeValue="changeValue"
                />
            </template>
            <div v-else class="field">
                <span class="label">{{ fieldName }}</span>
                <select v-if="hasFieldOptions(fieldName)" v-model="local[fieldName]" @change="changeValue">
                    <option v-for="option, key in fieldOptions(fieldName)" 
                        :key="option" 
                        :value="Array.isArray(fieldOptions(fieldName)) ? option : key"
                    >{{ option }}</option>
                </select>
                <input v-else v-model="local[fieldName]" :placeholder="fieldName" @input="changeValue" />
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
        fieldOptions(fieldName) {
            return this.model.fieldOptions(fieldName)
        },
        hasFieldOptions(fieldName) {
            // console.log(fieldName, this.model?.field(fieldName))
            // return Boolean(this.model?.field(fieldName)?.display?.component === 'select')
            return Boolean(this.model?.field(fieldName)?.options)
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
            console.log('this.displayFields.names', this.displayFields.names)
            // this.realDisplayFields = this.displayFields
            const names = this.data.$applyFieldsDisplayRules(
                this.displayFields.names
            )
            console.log('names', names)
            this.realDisplayFields = Object.values(this.displayFields.names).filter(item => item instanceof Group || names.includes(item))
            console.log('this.realDisplayFields', this.realDisplayFields)
        },

        isFieldGroup(fieldName) {
            return fieldName instanceof Group
        },
        isTab(fieldName) {
            return fieldName instanceof Tab
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
    }
}
</script>
