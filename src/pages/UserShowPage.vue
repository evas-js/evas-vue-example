<template>
    <div class="page">
        <h2>Show: {{ modelName }}</h2>
        {{ entity }}
    </div>
</template>

<script>
const MODEL_NAME = 'User';

export default {
    entity() {
        return {
            ID: null,
        };
    },
    computed: {
        model() {
            return this.$models?.[MODEL_NAME];
        },
        entity() {
            return this.model.find(this.ID);
        },
    },
    created() {
        this.ID = this.$route.params.id;

        if (!this.ID) return console.error('Отсутсвует ID');
        if (!this.model)
            return console.error('Отсутсвует модель: ', MODEL_NAME);

        this.model.fetchOne({ id: this.ID });
        if (!this.entity)
            return console.error('Отсутсвует запись с ID: ', this.ID);
    },
};
</script>
