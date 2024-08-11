const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: (config) => {
        // set environment variables
        config.plugin('define').tap((definitions) => {
            Object.assign(definitions[0], {
                // ... rest of your injected vars here
                // get rid of vue-i18n warning
                // __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
                __VUE_I18N_FULL_INSTALL__: JSON.stringify(true),
                __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
                __VUE_I18N_LEGACY_API__: JSON.stringify(false),
                __VUE_OPTIONS_API__: 'true',
            });
            return definitions;
        });
    },
})
