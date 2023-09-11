<template>
    <form>
        <fieldset>
            <legend>{{ title }}</legend>
            <div>
                <input v-model="data.$id" placeholder="id" disabled>
                <input v-model="data.name" placeholder="name">
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
                <input v-model="data.tags" placeholder="tags">
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
        }
    },
    computed: {
        model() {
            return this.$models[this.modelName]
        },
        typeOptions() {
            if (!this.model) return []
            let options = this.model.fieldOptions('type')
            // options[options.length] = 'incorrect'
            return options
        },
        roleOptions() {
            if (!this.model) return []
            let options = this.model.fieldOptions('role')
            // options['incorrect'] = 'incorrect'
            return options
        },
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
        save() {
            let tags = this?.data?.tags
            if (tags) {
                tags = tags.split(',')
                if (tags.length < 1 || !tags[0]) {
                    tags = null
                }
                this.data.tags = tags
            }
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
    // created() {
    //     this.setData()
    // },
}
</script>
