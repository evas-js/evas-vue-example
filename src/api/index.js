import { MockApi } from 'evas-vue'

const delay = 100

const response = (data, cb) => {
    if (cb) setTimeout(() => cb(data), delay)
}

const mockApi = new MockApi({ users: [] })

export const api = {
    user: {
        insert: (data, cb) => {
            response(mockApi.insert('users', data), cb)
        },
        update: (data, cb) => response(mockApi.update('users', data), cb),
        delete: (data, cb) => response(mockApi.remove('users', data), cb),
        list: (data, cb) => response(mockApi.list('users', data), cb),
    },
}
