// 提交申请 异步

import {login, changeUser, addGood, goodType, getTGData,
    getGood, getHome, addCar, setCar, getCar, delectCar,
    getCity, getCityAddress, address, getAddress,
    order, getOrder, changeOrder, insertCommit, 
    getCommit, search} from '../axios'

import {LOADING} from './actionTypes'


import {Toast, Indicator} from 'mint-ui'
import router from '../router'
export default {

    // 登陆
    async enterLogin({commit}, data){

        const res = await login(data)

        const {userData, code} = res.data

        if(code === 0) return Toast('验证码已失效')
        if(code === 1) return Toast('验证码错误')
        if(code === 500) return Toast('登陆失败，请稍后再试')

        commit('setState', {userData})
        // 跳转首页
        router.replace('/home')
    },
    // 修改用户信息
    async changeUser({commit}, data){

        const res = await changeUser(data)

        const {code} = res.data

        if(code === 0) return Toast('图片上传失败请稍后再试')
        if(code === 500) return Toast('修改失败，请稍后再试')
        if(code === 200) Toast('保存成功')

        return res.data
    },


    // 分类增删改查
    async goodType({commit, state}, {data, params}){

        const res = await goodType({data, params})

        state.loading && commit(LOADING)
        if(res.data.code === 0){
            Toast('图片上传失败')
        }else if(res.data.code === 500){
            Toast('操作失败，请稍后再试')
        }

        return res.data
    },

    // 添加商品
    async addGood({commit}, {data, params}){
        Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
        })

        const res = await addGood({data, params})
        const {code} = res.data
        Indicator.close()
        if(code === 0) return Toast('图片上传失败请稍后再试')
        if(code === 500) return Toast('添加失败，请稍后再试')

        return res.data
    },
    // 获取所有分类和商品
    async getTGData({commit, state}){
        const res = await getTGData()
        state.loading && commit(LOADING)
        return res.data
    },
    // 获取某个商品信息
    async getGood({commit, state}, data){
        
        const res = await getGood(data)
        state.loading && commit(LOADING)
        return res.data
    },
    // 获取某个商品信息
    async getHome({commit, state}, data){
        const res = await getHome(data)
        state.loading && commit(LOADING)
        return res.data
    },
    // 加入购物车
    async addCar({commit}, data){

        const res = await addCar(data)
        const {code} = res.data
        
        if(code === 200){
            Toast('已经放在购物车啦')
        }else if(code === 1){
            Toast('该商品已经在购物车里啦，去看看吧')
        }else if(code === 500){
            Toast('添加失败，请稍后再试一下吧')
        }
    },
    // 更新购物车
    async setCar({commit}, data){

        const res = await setCar(data)
        return res.data
    },

    // 获取购物车
    async getCar({commit, state}, data){
        const res = await getCar(data)
        state.loading && commit(LOADING)
        return res.data
    },
    // 删除购物车
    async delectCar({commit}, {data, params}){

        const res = await delectCar({data, params})


        return res.data

    },
    // 获取城市数据
    async getCity({commit}){

        const res = await getCity()


        return res.data

    },

    // 地址增改
    async address({commit}, data){

        const res = await address(data)
        return res.data

    },
    // 地址删查
    async getAddress({commit, state}, params){

        const res = await getAddress(params)
        state.loading && commit(LOADING)
        return res.data

    },
    // 订单增改
    async order({commit, state}, data){

        const res = await order(data)
        state.loading && commit(LOADING)
        return res.data

    },
    async changeOrder({commit}, data){

        const res = await changeOrder(data)

        return res.data

    },
    // 订单删查
    async getOrder({commit, state}, params){
        const res = await getOrder(params)
        state.loading && commit(LOADING)
        return res.data

    },
    // 评论发表
    async insertCommit({commit}, data){

        const res = await insertCommit(data)
        return res.data
    },
    // 评论获取
    async getCommit({commit}, data){

        const res = await getCommit(data)
        return res.data
    },
    // 搜索数据
    async search({commit}, data){
        Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
        })
        const res = await search(data)
        Indicator.close()
        return res.data
    },

    // 获取城市的具体位置
    async getCityAddress({commit}, cityObj){

        const res = await getCityAddress(cityObj)

        return res.data

    },

}