<template>
    <table class="TableView">
        <tr>
            <th v-for="key in keys" :key="key">{{ key }}</th>
            <td></td>
        </tr>
        <tr v-for="row in rows" :key="row.id">
            <template v-for="key in keys" :key="key">
                <!-- <td v-if="'referer_id' === key && row[key]">{{ row[key].name }}</td> -->
                <!-- <td v-else>{{ row[key] }}</td> -->
                <td>{{ row[key] }}</td>
            </template>
            <!-- <td>{{ row.referer }}</td> -->
            <td>
                <button @click="edit(row)">Edit</button>
                <button @click="row.$delete()">Delete</button>
            </td>
        </tr>
        <tr>
            <th :colspan="keys.length">
                totalRows: {{ model.totalRows }}
                size: {{ model.size() }}
            </th>
            <th>
                <button @click="model.clear">Clear</button>
                <button @click="fetchList">fetchList</button>
            </th>
        </tr>
    </table>

    <div class="forms">
        <EditForm
            :modelName="modelName"
            :entity="inserting"
            :title="'Add '+ modelName"
            btnText="+ Add"
            @saveCb="add"
        />
        <EditForm v-if="editing" 
            :modelName="modelName"
            :entity="editing" :title="'Edit '+ modelName +' #'+ editing.id"
            btnText="Save"
            @saveCb="update"
            @closeCb="close"
        />
    </div>

</template>

<script>
import EditForm from './EditForm.vue'

export default {
    props: {
        modelName: { type: String },
        showKeys: { type: Array, default: null },
    },
    data() {
        return {
            errors: [],
            editing: null,
            inserting: null,
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
            console.log(this.model.all())
            return this.model.query().withAll().get()
        },
    },
    methods: {
        add(data) {
            this.inserting = data
            // this.inserting = new this.model(data)
            this.inserting.$save(() => {
                console.log('!saved')
                if (this.inserting.$errors.length < 1) this.inserting = null
            })
        },
        isRelationKey(key) {
            return this.model.isRelationKey(key)
        },
        addError(message) {
            // this.errors.push(message)
            this.errors = [ message ]
        },
        edit(entity) {
            this.editing = entity
        },
        update() {
            this.editing.$save(() => {
                console.log('!saved')
                if (this.editing.$errors.length < 1) this.editing = null
            })
        },
        close() {
            this.editing = null
        },
        fetchList() {
            this.model.fetchList()
        },
    },
    created() {
        this.fetchList()
        this.model.setValidateErrorHandler(this.addError)
    },
    components: { EditForm }
}
</script>
