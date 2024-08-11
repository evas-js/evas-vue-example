<template>
    <h2>Home Page</h2>
    <br />
    <div class="list">
        Список моделей:
        <ol>
            <li v-for="modelName in modelList" :key="modelName">
                {{ modelName }}
            </li>
        </ol>
    </div>
    <div class="list">
        Записи модели User
        <table>
            <tr>
                <th>ID</th>
                <th>name</th>
            </tr>
            <tr v-for="row in rows" :key="row.$id">
                <td>{{ row.$id }}</td>
                <td>{{ row.name }}</td>
            </tr>
        </table>
        <button @click="fetchList">Load</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            modelName: 'User',
            str: 'User',
            text: 'User',
            select: 'User',
            options: ['User', 'aav', 'test'],
        };
    },
    computed: {
        model() {
            return this.$models[this.modelName];
        },
        modelList() {
            return Object.keys(this.$models);
        },
        rows() {
            return this.model.all()
        },
    },
    methods: {
        changeValue(name, value) {
            console.log('changeValue', name, value);
            this[name] = value;
        },
        fetchList() {
            // this.model.fetchList(null, (data) => {
            //     console.log('fetched', data)
            // })
            this.model.fetchList()
            .then((entities) => entities.forEach(entity => {
                console.table(Object.entries(entity))
            }))
        },
    },
    created() {
        // this.fetchList()
    },
};
</script>
