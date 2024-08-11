<template>
    <button
        class="btn"
        :class="{ 'btn-small': small }"
        @click="(e) => $emit('click', e)"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: {
        small: { type: Boolean, default: () => false },
    },
    emits: ['click'],
};
</script>
