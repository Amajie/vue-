
// 修改state的值 同步
import {LOADING} from './actionTypes'
import $router from '../router/index'
export default {
    setState(state, data){
        Object.keys(data).forEach(key => {
            state[key] = data[key]
        })
    },

    // 退出登陆
    delectData(state){
        sessionStorage.removeItem('state')
        sessionStorage.removeItem('selected')
        $router.replace('login')
    },

    [LOADING](state){
        state.loading = false
    }
}