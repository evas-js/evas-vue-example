<template>
    <div class="field fieldSelect">
        <select
            :name="name"
            :value="value"
            :multiple="multiple"
            :disabled="disabled"
            @input="changeValue"
        >
            <option
                v-for="(value, key) in options"
                :key="value"
                :value="optionValue(key)"
            >
                {{ value }}
            </option>
        </select>
    </div>
</template>

<script>
import BaseFieldMixin from './mixins/BaseFieldMixin';

export default {
    mixins: [BaseFieldMixin],
    props: {
        options: { type: [Array, Object], default: () => [] },
        multiple: { type: Boolean, default: () => false },
    },
    computed: {},
    methods: {
        optionValue(key) {
            return this.options?.[key];
        },
    },
};
</script>
