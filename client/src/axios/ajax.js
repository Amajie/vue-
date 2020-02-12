import axios from 'axios'
import $store from '../store'
// 传入一个配置对象 即为一个属性名为固定值的对象
const ajax = axios.create({
    baseURL: '/api',
    timeout: 8000,
    crossDomain: true,//设置cross跨域
    withCredentials: true
})

// 这里好像没用 
// ajax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 这样才是指定 urlencoded
// ajax.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
ajax.interceptors.request.use(
    config =>{
        return config
    },
    error =>{
        $store.commit('setState', {loading: false})
        return Promise.reject(error)
    }
)

// 响应拦截器
ajax.interceptors.response.use(
    response =>{
        console.log(response)
        return response
    },
    error =>{
        return Promise.reject(error)
    }
)

export default ajax