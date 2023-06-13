<template>
    <div class="about">
        <h1>Demo</h1>

        <TableView modelName="User" :showKeys="keys" />

    </div>
</template>

<script>
import TableView from '@/parts/TableView.vue'

export default {
    data() {
        return {
            keys: [
                'id', 'name', 'email', 'type', 'role', 'referer_id', 'referer.name',
            ],
        }
    },
    components: { TableView }
}
</script>
