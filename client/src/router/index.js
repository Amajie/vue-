import Vue from 'vue'
import Router from 'vue-router'
import $store from '../store'
Vue.use(Router)

// 一级路由
import Home from '../components/home/home.vue' // 首页
import Manage from '../components/manage/manage.vue' // 超市管理
import Car from '../components/car/car.vue' // 购物车
import Person from '../components/person/person.vue' // 个人中心
import Login from '../components/login/login.vue' // 登陆
import Detail from '../components/detail/detail.vue' // 详情页
import Setting from '../components/set/set.vue' // 设置个人信息
import GoodType from '../components/goodtype/goodtype.vue' // 分类管理
import FillOrder from '../components/fillorder/fillorder.vue' // 订单填写
import Address from '../components/address/address.vue' // 我的地址
import InceAddress from '../components/address/incraddress.vue' // 地址编写
import Order from '../components/fillorder/order.vue' // 订单
import Commit from '../components/commit/commit.vue' // 评论
import Search from '../components/search/searchwrap.vue' // 搜索

import Add from '../components/manage/child/addGood.vue' // 超市管理
import Type from '../components/goodtype/child/type.vue' // 编辑添加分类
import Four from '../components/com/four.vue' // 404
import Wrong from '../components/com/wrong.vue' // 出错了





const router =  new Router({
  mode: 'history', 
  scrollBehavior(to, from, savePosition){
    // console.log(document.querySelector('.search-wrap'))
  },
  routes: [
    {
      path: '/home',
      name: 'Home',
      meta:{
        tab_path: 'home',
        loading: true
      },
      component: Home,
    },
    {
      path: '/manage',
      name: 'Manage',
      meta:{
        tab_path: 'manage',
        loading: true,
      },
      component: Manage
    },
    {
      path: '/car',
      name: 'Car',
      meta:{
        tab_path: 'car',
        loading: true
      },
      component: Car
    },
    {
      path: '/person',
      name: 'Person',
      meta:{
        tab_path: 'person'
      },
      component: Person,
    },
    {
      path: '/login',
      name: 'Login',
      meta:{
        noLogin: true
      },
      component: Login
    },
    {
      path: '/detail/:goodId',
      name: 'Detail',
      meta:{
        loading: true
      },
      component: Detail
    },
    {
      path: '/set',
      name: 'Set',
      component: Setting
    },
    {
      path: '/add',
      name: 'Add',
      component: Add
    },
    {
      path: '/type',
      name: 'GoodType',
      meta:{
        loading: true
      },
      component: GoodType,
    },
    {
      path: '/ea*',
      name: 'Type',
      component: Type
    },
    {
      path: '/fill',
      name: 'FillOrder',
      component: FillOrder
    },
    {
      path: '/address',
      name: 'Address',
      meta:{
        loading: true
      },
      component: Address
    },
    {
      path: '/ince*',
      name: 'InceAddress',
      component: InceAddress
    },
    {
      path: '/order*',
      name: 'Order',
      meta:{
        loading: true
      },
      component: Order
    },
    {
      path: '/commit',
      name: 'Commit',
      component: Commit
    },
    {
      path: '/search',
      name: 'Search',
      meta:{
        keepAlive: true
      },
      component: Search
    },
    {
      path: '/wrong',
      name: 'Wrong',
      component: Wrong
    },
    {
      path: '/',
      redirect: '/Four'
    },
    {
      path: '*',
      name: 'Four',
      component: Four
    }
  ]
})

router.beforeEach((to, from, next) =>{

  // 根据tab_path这个参数是否显示 tabbar
  const {tab_path, loading, noLogin} = to.meta
  
  tab_path ? $store.commit('setState', {show_tabbar: true}):
            $store.commit('setState', {show_tabbar: false})

  $store.commit('setState', {loading: loading? true: false})

  // 前往登陆
  if(!noLogin && !$store.state.userData.userId){
      return next({path: '/login'})
  }

  next()
})

export default router
