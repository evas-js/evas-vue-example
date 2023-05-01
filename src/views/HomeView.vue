<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <CounterExample />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import CounterExample from '@/components/CounterExample.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    CounterExample
  }
}
</script>
