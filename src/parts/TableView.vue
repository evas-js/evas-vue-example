<template>
    <form @submit.prevent="add">
        <fieldset>
            <legend>Add {{ modelName }}</legend>
            <input v-model="newName" placeholder="name">
            <input v-model.number="newRefererId" placeholder="referer_id">
            <button type="submit">+ Add</button>
            <div class="errors">
                <div v-for="error,i in errors" :key="i">
                    {{ error }}
                </div>
            </div>
        </fieldset>
    </form>
    <table class="TableView">
        <tr>
            <th v-for="key in keys" :key="key">{{ key }}</th>
            <td></td>
        </tr>
        <tr v-for="row in rows" :key="row.id">
            <template v-for="key in keys" :key="key">
                <td v-if="'referer_id' === key && row[key]">{{ row[key].name }}</td>
                <td v-else>{{ row[key] }}</td>
            </template>
            <td>
                <button @click="edit">Edit</button>
                <button @click="row.$delete()">Delete</button>
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    props: {
        modelName: { type: String },
        showKeys: { type: Array, default: null },
    },
    data() {
        return {
            newName: '',
            newRefererId: null,
            errors: [],
        }
    },
    computed: {
        model() {
            return this.$models[this.modelName]
        },
        keys() {
            return this.showKeys
        },
        rows() {
            return this.model.query().withAll().get()
        },
    },
    methods: {
        add() {
            // console.log('add init')
            // this.model.insertOrUpdate({
            //     name: this.newName,
            //     referer_id: this.newRefererId,
            // })
            let row = new this.model({
                name: this.newName,
                referer_id: this.newRefererId,
            })
            row.$save()
            // this.newName = ''
        },
        edit() {},
        isRelationKey(key) {
            return this.model.isRelationKey(key)
        },
        addError(message) {
            this.errors.push(message)
        },
    },
    created() {
        this.model.fetchList()
        this.model.setDefaultValidateErrorHandler(this.addError)
    },
}
</script>
