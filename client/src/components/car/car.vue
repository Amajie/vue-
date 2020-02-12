<template>
    <div class="car">
        <div class="car-content">
            <Header fixed title="购物车" @right_click="manageFlag = !manageFlag" :right_text="manageFlag?'管理':'取消'" />
            <div class="car-list" ref="carList">
                <div class="list-wrap">
                    <div 
                        v-for="(item, index) in carData"
                        :key="index"
                        class="item-list line">
                        <div  @click="handleSelect(index)" class="car-radio">
                            <span :class="{select: item.carSelect, init: true}"></span>
                        </div>
                        <div class="item-pic">
                            <img :src="item.goodPic.split(',')[0]">
                        </div>
                        <div class="item-info">
                            <!-- 标题 -->
                            <div class="info-title">
                                <span>{{item.goodName}}</span>
                            </div>
                            <!-- 第二行 价格加入购物车 -->
                            <div class="price">
                                <p>
                                    <span class="now">{{item.goodPrice}} ￥</span>
                                    <span class="num"> 库存：{{item.goodNum}}</span>
                                </p>
                                <p class="c">
                                    <!-- 编辑和购物车切换 -->
                                    <img @click="handleAD(index, false)" src="./imgs/jian.png" />
                                    <span :value="item.carNum">{{item.carNum}}</span>
                                    <img @click="handleAD(index, true)" src="./imgs/jia.png" />
                                    
                                </p>
                            </div>
                        </div>
                    </div>

                    <NoData v-if="!carData.length" />
                    <p v-else class="no-more">{{noText}}</p>
                </div>
            </div>

            <transition>
                <div v-show="manageFlag" class="manage">
                    <div class="manage-wrap">
                        <div @click="handleSelectAll" class="manage-radio">
                            <span :class="{select: selectAll, init: true}"></span>
                            全选
                        </div>
                        <div class="total-price">
                            <span>合计：</span>
                            <span style="color: red;">{{total}}￥</span>
                        </div>
                        <div 
                            @click="handleFill"
                            :class="{'manage-btn': true, disabled: !selectNum}">
                            <span>结算</span>
                        </div>
                    </div>
                </div>
                </transition>
                <transition>
                <div v-show="!manageFlag" class="manage">
                    <div class="manage-wrap">
                        <div @click="handleSelectAll" class="manage-radio">
                            <span :class="{select: selectAll, init: true}"></span>
                            全选
                        </div>
                        <div  
                        @click="handleClearCar"
                        :class="{'manage-btn': true, disabled: !selectNum}">
                            <span>删除</span>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import Header from '../com/header.vue'
import NoData from '../com/noData.vue'
import Bscroll from 'better-scroll'
export default {
    data(){
        return {
            carData: [],
            maxCount: 0, // 当等于2时 发送前一个请求
            clickCount: 0,  // 当连续点击20次 点击不会发送请求 提示相应信息
            prevIndex: '', // 保存 上一个操作的购物车数据
            currentCar: 0,
            clearTime1: '',
            clearTime2: '',
            clearTime3: '',
            isSendFlag: false,
            total: 0, // 总价钱
            selectAll: false,
            selectNum: 0, //选择的个数 通过比较购物车的数量得出是否全选
            manageFlag: true,// 管理 价钱的切换标志
            noText: '',
            limit: 0,
            offset: 9
        }
    },
    methods:{

        // 购物车加减问题 处理了连续点击的问题
        handleAD(index, flag){
            
            /**
             * 1. 操作同一个数据 则操作完之后在发送请求
             * 2. 当操作不同数据时 前一个数据先发送 
             * 3. 操作过于频繁的时候 提示相关信息 并禁止发送请求以及操作
             * 
             */

            let {prevIndex, $store, carData, clickCount, isSendFlag,
            clearTime1, clearTime2, maxCount, changeCar, carOpa} = this

            if(isSendFlag){
                this.Toast('主人可以休息一会吗？我太累了')
                return this.clearTime3 = setTimeout(() =>{
                    this.isSendFlag = false
                    this.clickCount = 0
                    clearTimeout(this.clearTime3)
                }, 3000)
            }

            clearTimeout(clearTime2)

            // 保持最新的数据
            carOpa(carData[index], flag)


            this.currentCar = carData[index]
            this.clickCount = ++clickCount

            // 判断是否是操作同一个数据
            if(prevIndex === index){

                // 操作同一个数据 判断是加还是减
                clearTimeout(clearTime1)
                return this.clearTime1 = setTimeout(() =>{
                    changeCar(this.currentCar)
                    this.maxCount = --maxCount
                }, 1000)
            }else{

                this.maxCount = ++maxCount

                // 这里不能直接返回
                if(this.maxCount === 2){
                    changeCar(carData[this.prevIndex])
                    this.maxCount = --maxCount
                    this.prevIndex = index
                    return
                }

                this.prevIndex = index
            }

            // 只点击一次 发送请求
            this.clearTime2 = setTimeout(() =>{
                changeCar(this.currentCar)
                this.maxCount = 0
                this.prevIndex = ''
                clearTimeout(this.clearTime2)
            }, 2000)


        },
        // 发送请求
        changeCar(carObj){

            this.$store.dispatch('setCar', {
                count: carObj.carNum,
                carId: carObj.carId
            }).then(res =>{
                const {code} = res
                if(code === 200){
                    // 发送请求直接置为0
                    this.clickCount = 0
                }
            })
        },

        // 判断购物车数量 以及库存问题
        carOpa(data, flag){

            // 关闭提示
            this.toastObj && this.toastObj.close()

            if(flag){
                if(data.carNum >= data.goodNum){
                    this.toastObj = this.Toast('已经没有库存了')
                    return data.carNum = data.goodNum
                }
                data.carNum++
            }else{
                if(data.carNum <= 0){
                    this.toastObj = this.Toast('不能再减了')
                    return data.carNum = 0
                }
                data.carNum--
            }

            // 直接判断正负即可 注意没选中不需要计算价格
            data.carSelect && this.handleTotal(flag ? data.goodPrice : -data.goodPrice)
        },
        
        // 处理 选择问题
        handleSelect(index){

            let {selectNum, carData, handleTotal} = this
            
            const carObj = carData[index]

            // 计算价格
            const price = carObj.goodPrice * carObj.carNum
            this.selectNum = carObj.carSelect === 1 ? --selectNum: ++selectNum

            if(carObj.carSelect === 1){
                carObj.carSelect = 0
                return handleTotal(-price)
            }else{
                carObj.carSelect = 1
                return handleTotal(price)
            }

        },
        // 处理点击全选按钮
        handleSelectAll(){
            const {selectAll, carData} = this

            
            this.selectAll = !selectAll
            // 重置选择的长度
            this.selectNum = !selectAll? carData.length: 0
            // 计算价格 直接赋值
            let saveTotal = 0

            carData.forEach(item => {
                if(this.selectAll){
                    item.carSelect = 1
                    saveTotal += item.carNum*item.goodPrice
                }else{
                    item.carSelect = 0
                }      
            })

            // 赋值
            this.total = saveTotal
        },

        // true 选中 否则不选中
        handleTotal(price){
            this.total += price
        },

        // 清空
        handleClearCar(){

            this.selectNum && this.MessageBox.confirm('是否继续删除?').then(action => {

                // 1.过滤数据
                const {selectCarData, newCarData} = this.handlFilter()

                // 2.发送请求
                this.$store.dispatch('delectCar', {
                    params: {
                        carUserId: this.carData[0].carUserId
                    },
                    data:{
                        carIdList: selectCarData
                    }
                }).then(res =>{
                    if(res.code === 200){
                        this.carData = newCarData
                        this.selectNum = 0
                        this.total = 0
                        this.$store.commit('initCarGoodList', newCarData)
                    }
                })


            }, () =>{})
        },
        // 结算
        handleFill(){

            // 老板无需下单
            if(this.$store.state.userData.userGrade) 
                return this.Toast('您是老板无需下单哟，打电话就行了呢')

            // 没有选择商品不能呢点击
            if(!this.selectNum) return

            // 1.过滤数据
            const {fillOrderObj} = this.handlFilter(true)
            // 2.保存在sessionStorage
            sessionStorage.setItem('fillOrderObj', JSON.stringify(fillOrderObj))
            // 3.跳转
            this.$router.push('/fill')
        },

        // 拿取选中和没选中的数组
        handlFilter(isOrder){


            const selectCarData = []
            const fillOrderObj = {
                totalNum: 0,
                totalPrice: 0,
                orderData: []
            }
            // 1.遍历拿到选中的carId
            const newCarData = this.carData.filter(item =>{
                // 订单处理 获取选中以及数量不为零的数据
                if(item.carSelect&& item.carNum && isOrder){
                    // 获取数据
                    const obj = {}
                    obj.goodPic = item.goodPic.split(',')[0]
                    obj.carNum = item.carNum
                    obj.goodPrice = item.goodPrice
                    obj.goodName = item.goodName
                    obj.goodId = item.goodId
                    obj.oGoodLetter = ''

                    // 获取数据
                    fillOrderObj.totalNum += item.carNum
                    fillOrderObj.totalPrice += item.carNum*item.goodPrice
                    fillOrderObj.orderData.push(obj)

                // 只获取id
                }else if(item.carSelect && !isOrder){
                    selectCarData.push(item.carId)
                }
                // 返回未选中数组
                return !item.carSelect
            })

            return {selectCarData, fillOrderObj, newCarData}
        },

        // 发送拿取购物车的数据
        getCarData(){
            const {$store, limit, offset} = this

            $store.dispatch('getCar', {
                carUserId: $store.state.userData.userId,
                limit,
                offset
            })
            .then(res =>{
                const {code, carData} = res
                // 关闭加载图标
                this.Indicator.close()
                
                if(code === 200) {
                    this.carData = this.carData.concat(carData)
                    // 有数据 则需要再次触发上拉刷新
                    this.noData && this.closePullUpLoad()
                    this.noData = true
                }
                
                if(carData.length < offset){
                    this.noText= '没有更多了'
                    this.noData = false
                }
                
            })
        },

        _scrollInit(){

            this.$nextTick(() =>{

                this.carList = new Bscroll(this.$refs.carList, {
                    click: true,
                    bounce: {
                        top: false,
                        bottom: true,
                    }
                })

                this.carList.on('touchEnd', (pos) =>{

                    if(pos.y < -90){

                        if(!this.noData) return 
                        
                        // 继续获取数据
                        this.getCarData()
                        this.Indicator.open({
                            text: '加载中...',
                            spinnerType: 'fading-circle'
                        })
                    }
                })
            })
        },

        closePullUpLoad(){
            this.carList.refresh()
        }
    },

    watch:{
        clickCount(value){
            if(value >= 20){
                this.isSendFlag = true
            }
        },
        selectNum(value){
            // 是否相等即可 前提  this.carData.length有值 后期可以使用标志位
            this.selectAll = this.carData.length && value === this.carData.length
        },
        carData(){
            this.limit +=1
        }
    },

    created(){
        // 获取购物车数据
        this.getCarData()
    },
    mounted(){
        this._scrollInit()
    },
    components:{
        Header,
        NoData
    }
}
</script>

<style lang="less" scoped>
.car{
    height: 100%;
    .car-content{
        height: 100%;
        .car-list{
            position: fixed;
            top: 45px;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            .list-wrap{
                padding-bottom: 180px;
                min-height: 100%;
                background-color: #e0e0e0;
                .item-list{
                    display: flex;
                    padding: 10px 0;
                    padding-right: 5px;
                    position: relative;
                    background-color: #fff;
                    .car-radio{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 0 15px;
                    }
                    .item-pic{
                        margin-right: 5px;
                        img{
                            width: 70px;
                            height: 70px;
                        }
                    }
                    .item-info{
                        display: flex;
                        flex: 1;
                        flex-direction: column;
                        .info-title{
                            font-size: 18px;
                            line-height: 20px;
                        }
                        .price{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding-top: 20px;
                            p{
                                font-size: 15px;
                                .now{
                                    color: red;
                                }
                                .num{
                                    color: #ccc;
                                }
                                img{
                                    width: 25px;
                                    height: 25px;
                                }
                            }
                            .c{
                                display: flex;
                                align-items: center;
                                span{
                                    width: 45px;
                                    height: 22px;
                                    margin: 0 5px;
                                    line-height: 20px;
                                    border-radius: 1px;
                                    text-align: center;
                                    background-color: #e0e0e0;
                                }
                                img{
                                width: 22px;
                                height: 22px;
                                }
                            }
                        }
                    }
                }
            }
        }

        .manage{
            position: fixed;
            left: 0;
            bottom: 55px;
            width: 100%;
            padding: 10px;
            padding-bottom: 15px;
            background-color: #fff;
            .manage-wrap{
                display: flex;
                justify-content: space-around;
                align-items: center;
                .manage-radio{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 17px;
                    span{
                        margin: 0 10px;
                    }
                }
                .total-price{
                    font-size: 16px;
                }
                .manage-btn{
                    color: #fff;
                    padding: 6px 15px;
                    border-radius: 5px;
                    background-color: red;
                    &:active{
                        background-color: #ff5a5a;
                    }
                }
                .disabled{
                    background-color: #ff5a5a;
                }
            }
        }

        .v-enter,
        .v-leave-to{
            opacity: 0;
            transform: translateX(-100%);
        }
        .v-enter-active,
        .v-leave-active{
            transition: all 0.5s;
        }
    }

    .init{
        display: block;
        width: 25px;
        height: 25px;
        border-radius: 3px;
        border: 1px solid #ccc;
        background: url('./imgs/init.png') no-repeat;
        background-size: 25px 25px;
    }
    .select{
        background: url('./imgs/select.png') no-repeat;
        background-size: 25px 25px;
    }
}
</style>