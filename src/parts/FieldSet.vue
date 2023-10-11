<template>
    <div class="fieldset">
        <template v-for="fieldName, name in realDisplayFields" :key="fieldName">
            <template v-if="isFieldGroup(fieldName)">
                {{ name }}
                {{ fieldName }}
                <FieldSet v-if="isShown(fieldName)"
                    :data="data"
                    :displayFields="fieldName.items"
                    :model="model"
                    @changeValue="changeValue"
                />
                <span @click="hide(fieldName)">Hide</span>
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
import { FieldGroup } from '@/core/Field/FieldGroup.js'

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
            return Boolean(this.model?.field(fieldName)?.options)
        },
        isFieldGroup(fieldName) {
            return fieldName instanceof FieldGroup
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
            this.realDisplayFields = this.data.$applyFieldsDisplayRules(
                this.displayFields
            )
        },

        isShown(group) {
            return !group.hidden
        },

        hide(group) {
            group.toggle()
        },
    },
    created() {
        this.local = this.data
        this.updateDisplayFields()
    }
}
</script>
