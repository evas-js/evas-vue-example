<template>
    <div class="tableView">
        <h2>{{ modelName }}</h2>
        <div class="tableView-main">
            <table>
                <thead>
                    <tr>
                        <th v-for="key in keys" :key="key">
                            <span>{{ key }}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!rows.length">
                        <td v-if="loading" :colspan="columnLength">
                            Загрузка...
                        </td>
                        <td v-else :colspan="columnLength">Нет данных</td>
                    </tr>
                    <tr v-for="row in rows" :key="row">
                        <td
                            v-for="key in keys"
                            :key="key"
                            class="key"
                            @click="() => clickRow(row)"
                        >
                            <span>{{ row[key] }}</span>
                        </td>
                        <td>
                            <button @click="() => clickRow(row, 'edit')">
                                Edit
                            </button>
                            <BaseBtn small @click="() => clickRow(row, 'edit')">
                                Edit
                            </BaseBtn>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="tableView-info">Total: {{ rows.length }}</div>
    </div>
</template>

<script>
export default {
    props: {
        modelName: { type: String, required: true },
        keys: { type: Array, default: () => [] },
        routeName: { type: String, default: () => '/' },
    },
    data() {
        return {
            loading: null,
            model: null,
            ids: null,
        };
    },
    computed: {
        rows() {
            return this.ids ? this.model?.find(this.ids) : [];
        },
        columnLength() {
            return this.keys.length;
        },
    },
    methods: {
        load() {
            this.loading = true;
            this.model.fetchList({}, (data, entities) => {
                this.loading = false;
                this.ids = [];
                entities?.length &&
                    entities.forEach((entity) => {
                        this.ids.push(entity.$id);
                    });
            });
        },
        clickRow({ id }, type = 'show') {
            this.$router.push(`${this.routerName}/${type}/${id}`);
        },
    },
    created() {
        if (!this.modelName) return console.error('Отсутствует modelName');

        this.model = this.$models[this.modelName];

        if (!this.model)
            return console.error('Нет такой модели:', this.modelName);
    },
};
</script>
