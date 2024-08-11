<template>
    <nav>
        <router-link v-for="(link, i) in links" :key="i" :to="link.path">
            {{ link.title }}
        </router-link>
    </nav>
</template>

<script>
export default {
    props: {
        links: { type: Array, default: () => [] },
    },
};
</script>
