<template>
    <fieldset>
        <legend>CounterExample</legend>
        <button @click="increment">increment</button>
        <button @click="reset">reset</button>
        <p>Counter: {{ counter }}, from $state: {{ $state.counter }}</p>
        <p>Without state: {{ counter2 }}</p>
    </fieldset>
</template>

<script>
export default {
    data() {
        return {
            counter2: 0,
        }
    },
    computed: {
        counter() {
            return this.$state.counter || 0
        },
    },
    methods: {
        increment() {
            if (!this.$state.counter) this.$state.counter = 0
            this.$state.counter++
            this.counter2++
        },
        reset() {
            this.$state.counter = 0
            this.counter2 = 0
        },
    },
}
</script>
