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
    </table>

    <div class="forms">
        <UserForm
            :modelName="modelName"
            :entity="inserting"
            :title="'Add '+ modelName"
            btnText="+ Add"
            @saveCb="add"
        />
        <UserForm v-if="editing" 
            :modelName="modelName"
            :entity="editing" :title="'Edit '+ modelName +' #'+ editing.id"
            btnText="Save"
            @saveCb="update"
        />
    </div>

</template>

<script>
import UserForm from './UserForm.vue'

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
            this.inserting = new this.model(data)
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
    },
    created() {
        this.model.fetchList()
        this.model.setValidateErrorHandler(this.addError)
    },
    components: { UserForm }
}
</script>
