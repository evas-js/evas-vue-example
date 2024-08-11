<template>
    <NavigationList :links="links" />
    <router-view></router-view>
</template>

<script>
import NavigationList from '@/parts/common/NavigationList.vue';
export default {
    data() {
        return {
            links: [
                { path: '/', title: 'Home' },
                { path: '/user', title: 'UserList' },
            ],
        };
    },
    components: { NavigationList },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
