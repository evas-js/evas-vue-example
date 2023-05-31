<template>
    <div class="about">
        <h1>Demo</h1>

        <TableView modelName="User" :showKeys="['id','name', 'referer_id', 'referer']" />

    </div>
</template>

<script>
import TableView from '@/parts/TableView.vue'

export default {
    components: { TableView }
}
</script>
