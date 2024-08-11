export class RestApiContract {
    crud = {
        insert: {
            method: 'POST',
        },
        update: {
            method: 'PUT',
        },
        delete: {
            method: 'DELETE'
        },
        one: {
            method: 'GET',
            path: ':id'
        },
        list: {
            method: 'GET',
        },
    }
}


export class Contract {
    types
    constructor(types) {
        if (!types || typeof types !== 'object') {
            throw Error('Contract types must be an object')
        }
        this.types = types
    }
    
    makeRequest(type, resource, config) {
        let props = this.types[type]
        if (!props) return [resource, config]
        let method = props?.method || config?.method
        let path = resource?.path || '/'
        if (props.path) path += props.path
        return [path, [...config, method]]
    }

    parseRequest(resource, config, routes) {
        let parts = resource.split('/')
        // parts.forEach(part => {
        //     if (part.startsWith(':')) {
        //         // 
        //     }
        // })
        routes.forEach(route)
    }
}

export const restApiContract = new Contract(
    // request
    {
        insert: { method: 'POST' },
        update: { method: 'PUT' },
        delete: { method: 'DELETE' },
        one: { method: 'GET', path: ':id' },
        list: { method: 'GET' },
    },
    // response
    FetchedDataParser,
)
