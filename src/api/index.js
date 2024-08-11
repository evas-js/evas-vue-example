import { contract } from './api.contract.js'
import { handler } from './api.handler.js'
import { initRequestInterceptor as init } from './api.initRequestInterceptor.js'
import { mocks } from './api.mocks.js'

export default {
    enabled: true,
    handler,
    contract,
    requestInterceptor: {
        enabled: true,
        init,
        mocks,
    },
}
