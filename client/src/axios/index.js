// 请求函数
import ajax from './ajax'

// 登陆
export const login = data => ajax({url: '/login', method: 'post', data})
// 修改用户信息
export const changeUser = data => ajax({url: '/change_user', method: 'post', data})
// 分类
export const goodType = ({data, params}) => ajax({url: '/good_type', method: 'post', data, params})
// 添加商品
export const addGood = ({data, params}) => ajax({url: '/add_good', method: 'post', data, params})
// 获取商品、分类数据
export const getTGData = () => ajax({url: '/get_t_g_data', method: 'get'})
// 获取某个商品的信息 以及对应的分类信息
export const getGood = params => ajax({url: '/get_good', method: 'get', params})
// 获取首页数据
export const getHome = params => ajax({url: '/get_home', method: 'get', params})
// 加入购物车
export const addCar = data => ajax({url: '/add_car', method: 'post', data})
// 更新购物车
export const setCar = data => ajax({url: '/set_car', method: 'post', data})
// 获取购物车
export const getCar = params => ajax({url: '/get_car', method: 'get', params})
// 删除购物车
export const delectCar = ({data, params}) => ajax({url: '/delect_car', method: 'post', data, params})
// 获取城市数据
export const getCity = () => ajax({url: '/getCity', method: 'get'})
// 获取具体地址
export const getCityAddress = ({id, keyWord}) => ajax({url: `https://elm.cangdu.org/v1/pois?city_id=${id}&keyword=${keyWord}&type=search`})
// 地址增删改查
export const address = data => ajax({url: `/address`, method: 'post', data})
export const getAddress = params => ajax({url: `/get_address`, method: 'get', params})
// 订单的增删改查
export const order = data => ajax({url: `/order`, method: 'post', data})
export const changeOrder = data => ajax({url: `/change_order`, method: 'post', data})
export const getOrder = params => ajax({url: `/get_order`, method: 'get', params})

// 评论发表
export const insertCommit = data => ajax({url: `/insert_commit`, method: 'post', data})
// / 评论获取
export const getCommit = params => ajax({url: `/get_commit`, method: 'get', params})
// 搜索数据
export const search = params => ajax({url: `/search`, method: 'get', params})