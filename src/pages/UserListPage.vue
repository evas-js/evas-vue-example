<template>
    <div class="page">
        <TableView modelName="User" :keys="keys" routeName="user" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            keys: ['id', 'name'],
        };
    },
};
</script>
