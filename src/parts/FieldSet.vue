<template>
    <div class="fieldset">
        <div v-for="fieldName in displayFields" :key="fieldName" class="field">
            <span class="label">{{ fieldName }}</span>
            <select v-if="hasFieldOptions(fieldName)" v-model="local[fieldName]" @change="changeValue">
                <option v-for="option, key in fieldOptions(fieldName)" 
                    :key="option" 
                    :value="Array.isArray(fieldOptions(fieldName)) ? option : key"
                >{{ option }}</option>
            </select>
            <input v-else v-model="local[fieldName]" :placeholder="fieldName" @input="changeValue" />
        </div>
    </div>
</template>

<script>

// @change="changeValue(fieldName, $event)"
export default {
    props: {
        data: { type: Object, required: true },
        displayFields: { type: Array, default: () => [] },
        model: { type: Function, required: true },
    },
    emits: ['changeValue'],
    data() {
        return {
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
        // changeValue(fieldName, e) {
        //     console.log(fieldName, e.target.value)
        //     this.$emit('changeValue', fieldName, e.target.value)
        // },
        changeValue() {
            this.$emit('changeValue')
        },
    },
    created() {
        this.local = this.data
    }
}
</script>
