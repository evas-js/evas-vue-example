export default {
    props: {
        name: { type: String, default: null },
        value: { type: [String, Array, Object, Boolean], default: null },
        disabled: { type: Boolean, default: () => false },
    },
    emits: ['changeValue'],
    methods: {
        changeValue(e) {
            this.$emit('changeValue', this.name, e.target.value);
        },
    },
};
