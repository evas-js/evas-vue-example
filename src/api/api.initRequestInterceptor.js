// import { RequestInterceptor } from '@/core/evas-vue'
// import { EvasVue } from '@/core/evas-vue'
// import { Contract } from '@/core/evas-vue/contracts/RestAPI/RestAPIContract'


// class User {
//     static routes = {
//         prefix: '/users',
//         actions: ['insert', 'update', 'delete', 'list', 'one', 'download']
//     }
// }

// SKDPUNT_PostFull
// /users/insert

// RestFull
// /users POST

// function interceptModel(modelName, interceptor) {
//     Contract.makeEnpoints('User').forEach(({ enpoint, action }) => {
//         interceptor.push( Contract.makeResponseHandler('User', mocks, action) )
//     })
// }
const { protocol, hostname, port} = window.location
export const currentPrefix = protocol + '//' + hostname + (port ? (':' + port) : '')

export function initRequestInterceptor(requestInterceptor) {
    console.log('initRequestInterceptor', requestInterceptor)
    requestInterceptor.listen([
        // 'http://itevas.ru',
        // 'http://evas-php.com',
        currentPrefix
    ], (interceptor) => {
        interceptor.post('/users/list', () => {
            const users = requestInterceptor.mocks.User.all()
            console.log('User LIST', users)
            return users
        })

        interceptor.get('/', (request) => {
            console.log('Home handler', request)
        })
        interceptor.get('/users/:id', (request) => {
            // console.log('User id handler', request)
            console.log('User with id', request.params.id, requestInterceptor.mocks.User.find(request.params.id))
        })
        interceptor.get('/users/:id([a-zA-Z0-9_-]{1,10})', (request) => {
            console.log('User id handler', request)
        })
        interceptor.get('/users/:id/company/:company_id', (request) => {
            console.log('User with company', request)
        })
        interceptor.group('/admin', (request) => {
            console.log('Admin handler', request)
        })
        
        // моки + контракт (составление эндпоинта + выдача ответа из моков) + имя модели
        // interceptModel('User', interceptor)
        // EvasVue.models.forEach(model => {
        //     interceptModel(model, interceptor)
        // })

        // interceptorCrudMaker
        // interceptor.group('/test', (group) => {
        //     group.get('/', () => {
        //         console.log('Test home handler')
        //     })
        // })
        // interceptor.setFormat()
        // interceptor.routesByFormat(new PostFullFormat((routes) => {
        //     routes.crud('User')
        // }))
    })
    requestInterceptor.passthrough()
}

window.sendXHR = function (path = 'http://itevas.ru/') {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', path)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('X-Auth', '123')
    xhr.overrideMimeType('text/plain')
    // console.log(xhr)
    // xhr.send()
    xhr.send('body data')

    xhr.onload = function() {
        if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
          alert(`Ошибка ${xhr.status}: ${xhr.statusText}`) // Например, 404: Not Found
        } else { // если всё прошло гладко, выводим результат
          alert(`Готово, получили ${xhr.response.length} байт`) // response -- это ответ сервера
        }
    }
}
