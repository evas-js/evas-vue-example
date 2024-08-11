//  export const api  = {
//     User: {
//         list: (args, cb) => {
//             console.log('User.list', args, cb)
//             // return { id: 3, name: 'Alex' }
//             setTimeout(() => cb({
//                 statusCode: 200,
//                 body: [{ id: Math.round(Math.random() * 10), name: 'Test' }],
//             }), 1000)
//         },
//     },
//  }

// export const api = {}

//  export const api2 = {}
//  EvasVue.setApiEntriesFromModels(api2)


import { currentPrefix } from "./api.initRequestInterceptor"


export function handler(params) {
    console.log('[API handler]', arguments)
    // return { 
    //     statusCode: 200,
    //     body: [{ id: Math.round(Math.random() * 10), name: 'Test' }],
    // }
    return new Promise((resolve) => {
        // setTimeout(() => resolve({
        //     statusCode: 200,
        //     body: [{ id: Math.round(Math.random() * 10), name: 'Test' }],
        // }), 1000)
        const url = currentPrefix + params.url
        fetch(url, params).then((response) => {
            console.log(response)
            resolve(response)
        })
    })
}
