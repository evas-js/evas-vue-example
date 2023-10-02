<template>
    <div class="about">
        <h1>Demo</h1>

        <TableView modelName="User2" :showKeys="keys" />

        <!-- <p>{{ result }}</p> -->

    </div>
</template>

<script>
import TableView from '@/parts/TableView.vue'

export default {
    data() {
        return {
            keys: [
                'id', 'name', 
                // 'email', 
                // 'type', 'role', 
                'tagAny', 'tagsAny', 'tagsArray',
                // 'referer_id', 'referer.name',
            ],
        }
    },
    // computed: {
    //     model() {
    //         return this.$models.User2
    //     },
    //     result() {
    //         if (this.model.size() < 1) return null
    //         // return this.model.query().whereIn('id', [1,2,3]).get('name')
    //         // return this.model.query().whereIn('id', [1,2,3]).get(['id', 'name'])
    //         return this.model.query().whereIn('id', [1,2,3]).get({'key': 'id', 'value': 'name'})
    //     },
    // },
    components: { TableView }
}
</script>
