
export class Route {
    method
    path
    constructor(method, path) {
        this.method = (method || 'GET').toUpperCase()
        this.path = path
    }
}
