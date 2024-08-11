<template>
    <div class="field fieldString">
        <input
            type="text"
            :name="name"
            :value="value"
            :disabled="disabled"
            @input="changeValue"
        />
    </div>
</template>

<script>
import BaseFieldMixin from './mixins/BaseFieldMixin';

export default {
    mixins: [BaseFieldMixin],
};
</script>
