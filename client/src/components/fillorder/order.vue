<template>
    <div class="order">
        <Header 
            :fixed="true"
            :left_icon="require('./imgs/left.png')"
            @left_click="$router.replace('/person')"
            :title="title"/>
        <div class="order-wrap" ref="orderList">
            <div class="order-list">
                <div 
                    v-for="(item, index) in myOrderData"
                    :key="index"
                    class="order-item line"
                    >

                    <!-- 列表 -->
                    <div class="o-list">
                        <div 
                            v-for="(val, index) in item.goods"
                            :key="index"
                            class="o-item">
                            <img :src="val.goodPic" />
                            <div class="i">
                                <span class="t">{{val.goodName}}</span>
                                <p>
                                    <span class="p">{{val.goodPrice}}￥ x {{val.carNum}}件</span>
                                    <span v-if="orderOp === 3" class="btn-commit" 
                                        @click="toCommit(item.orderId, val.goodId)">评价</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- 商品信息 -->
                    <div class="info">
                        <p>
                            <span class="num">共{{item.orderTotalNum}}件商品 </span>
                            <span class="price">合计：{{item.orderTotalPrice}}￥</span>
                        </p>
                        <p>
                            <span class="time">{{item.orderTime}}</span>
                        </p>
                    </div>
                    <!-- 备注 -->
                    <div class="address-letter">
                        <div>
                            <i>地址：</i>
                            <p>
                                <span>{{item.orderName+' '+item.orderPhone}}</span>
                                <span>{{item.orderAddress}}</span>
                            </p>
                        </div>
                        <div>
                            <i>备注：</i> 
                            <span>{{item.oGoodLetter? item.oGoodLetter: '无'}}</span>
                        </div>
                    </div>
                    <div class="order-btn">
                        <div 
                            v-if="!$store.state.userData.userGrade" 
                            class="order-op">
                            <p>
                                <mt-button size="small"
                                    v-if="orderOp === 1 || orderOp === 2" 
                                    @click.native="showMessage(item, postSell, postSellOp)">申请退款</mt-button>
                            </p>
                            <p>
                                <mt-button size="small" 
                                    v-if="item.sendGoodFlag" 
                                    @click.native="showPopup"
                                    type="primary">查看物流</mt-button>
                            </p>
                            <p>
                                <mt-button v-if="orderOp === 2" size="small" type="danger"
                                    @click.native="showMessage(item, finish, finishOp, index)">确认收货</mt-button>
                            </p>
                        </div>
                        <div v-else class="boss-op">
                            <p>
                                <mt-button size="small"
                                    v-if="orderOp === 1" 
                                    @click.native="showMessage(item, sendGood, sendGoodOp, index)">
                                    确认发货
                                </mt-button>
                            </p>
                            <p>
                                <mt-button size="small" 
                                    v-if="orderOp != 1" 
                                    @click.native="showPopup"
                                    type="primary">查看物流</mt-button>
                            </p>
                        </div>
                    </div>
                </div>
                <NoData v-if="!myOrderData.length" />
                <p class="no-more" v-else>{{noText}}</p>
            </div>
            
        </div>

        <div class="popup">
            <mt-popup
                v-model="popupFlag"
                position="bottom">
                <p class="popup">
                    <span class="t">只是模拟</span>
                    <span>北京物流有限公司正在打包...</span>
                </p>
            </mt-popup>
        </div>
    </div>
</template>
<script>
import Header from '../com/header.vue'
import NoData from '../com/noData.vue'
import Bscroll from 'better-scroll'
import {Toast, MessageBox} from 'mint-ui'
export default {
    data(){
        return {
            myOrderData:[],
            postSell: '是否申请退款？',
            finish: '是否确认收货？',
            sendGood: '是否发货？',
            postSellOp: 'postSellFlag',
            finishOp: 'finishFlag',
            sendGoodOp: 'sendGoodFlag',
            orderOp: 1, // 默认为待发货
            scrollY: 0,
            limit: 0,
            offset: 3,
            title: '待发货',
            noText: '',// 数据加载完毕提示文字
            popupFlag: false
        }
    },
    methods:{

        // 获取的订单需要处理
        handleGetOrder(orderData){

            const arr = orderData.map(item =>{

                const orderObj = {}
                const goodData = []
                let totalPrice = 0
                let totalNum = 0

                orderObj.orderId = item.orderId
                orderObj.commitFlag = item.commitFlag
                orderObj.finishFlag = item.finishFlag
                orderObj.sendGoodFlag = item.sendGoodFlag
                orderObj.postSellFlag = item.postSellFlag
                orderObj.orderName = item.orderName
                orderObj.orderPhone = item.orderPhone
                orderObj.orderAddress = item.orderAddress
                orderObj.orderTime = item.orderTime
                orderObj.oGoodLetter = item.oGoodLetter
                
                item.oGoodPrice.split(',').map((val, index) =>{

                    let goodObj = {}

                    // 获取数据
                    goodObj.goodPic = item.oGoodPic.split(',')[index]
                    goodObj.goodId = item.oGoodId.split(',')[index]
                    goodObj.goodPrice = parseFloat(item.oGoodPrice.split(',')[index])
                    goodObj.carNum = parseFloat(item.oGoodNum.split(',')[index])
                    goodObj.goodName = item.oGoodName.split(',')[index]

                    // 计算价格 和件数
                    totalPrice += goodObj.carNum * goodObj.goodPrice
                    totalNum += goodObj.carNum

                    // 存储数据
                    goodData.push(goodObj)

                    goodObj = null

                })

                orderObj.goods = goodData
                orderObj.orderTotalPrice = totalPrice
                orderObj.orderTotalNum = totalNum

                return orderObj
            })

            this.myOrderData = this.myOrderData.concat(arr)

            this.noData && this.closePullUpLoad()

            this.noData = true
        },

        // 获取订单数据
        handleSend(){

            const {limit, offset, $store, orderOp} = this

            $store.dispatch('getOrder', {
                orderUserId: $store.state.userData.userId,
                orderOp: this.orderOp,
                limit,
                offset,
                userGrade: $store.state.userData.userGrade
            }).then(res =>{

                this.Indicator.close()
                if(res.code === 200)
                    this.handleGetOrder(res.orderData)
                
                if(res.orderData.length < offset){
                    this.noText= '没有更多了'
                    this.noData = false
                }
            })
        },
        // 处理申请退款
        handlePostSell(orderData, option, index){

            this.$store.dispatch('changeOrder', {
                orderId: orderData.orderId,
                goodId: orderData.goods[0].goodId,
                carNum: orderData.goods[0].carNum,
                orderUserId: this.$store.state.userData.userId,
                [option]: 1
            }).then(res =>{
                const {code} = res
                if(code === 200){
                    console.log(res)
                    this.myOrderData.splice(index, 1)
                    this.Toast('操作成功')
                }else if(code === 500){
                    this.MessageBox.alert('操作失败，请稍后再试')
                }
            })
        },

        // 显示提示框 统一处理
        showMessage(orderData, msg, option, index){
            this.MessageBox.confirm(msg).then(
                action =>{
                    this.handlePostSell(orderData, option, index)
                },
                () =>{}
            )
        },
        // 前往评论
        toCommit(orderId, goodId){
            sessionStorage.setItem('orderInfo', JSON.stringify({orderId, goodId}))
            this.$router.push('/commit')
        },
        // 显示物流
        showPopup(){
            this.popupFlag = !this.popupFlag
        },

        // 下拉刷新
        _scrollInit(){
            this.$nextTick(() =>{

                this.orderList = new Bscroll(this.$refs.orderList, {
                    click: true,
                    bounce: {
                        top: false,
                        bottom: true,
                    },
                    pullUpLoad: {
                        threshold: 80
                    }

                })



                this.orderList.on('touchEnd', (pos) =>{

                    if(pos.y < -50){
                        if(!this.noData) return 
                        
                        this.handleSend()
                        this.indicator = this.Indicator.open({
                            text: '加载中...',
                            spinnerType: 'fading-circle'
                        })
                    }
                })
            })
        },

        closePullUpLoad(){
            this.orderList.refresh()
        }
    },

    created(){
        const path = this.$route.params.pathMatch.split('/')[1]
        this.orderOp = path? parseInt(path): 1
        

        if(this.orderOp === 2){
            this.title = '待收货'
        }else if(this.orderOp === 3){
            this.title = '待评价'
        }else if(this.orderOp === 4){
            this.title = '售后'
        }else if(this.orderOp === 5){
            this.title = '我的订单'
        }
        this.handleSend()
        
    },
    mounted(){
        this._scrollInit()
    },
    watch:{
        myOrderData(){
            this.limit +=1
        }
    },
    components:{
        Header,
        NoData
    }
}
</script>

<style lang="less" scoped>
.order{
    .order-wrap{
        position: fixed;
        top: 45px;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .order-list{
            padding-bottom: 70px;
            .order-item{
                position: relative;
                padding: 5px 10px;
                .o-list{
                    margin-top: 5px;
                    .o-item{
                        display: flex;
                        position: relative;
                        padding: 10px 0;
                        > img{
                            width: 90px;
                            height: 90px; 
                        }
                        .i{
                            display: flex;
                            flex: 1;
                            flex-direction: column;
                            padding-left: 10px;
                            .t{
                                padding: 5px 0;
                                font-size: 18px;
                            }
                            p{
                                display: flex;
                                align-items: center;
                                justify-content: flex-end;
                                font-size: 16px;
                                .p{
                                    text-align: right;
                                }
                                .btn-commit{
                                    color: #FFF;
                                    padding: 5px 10px;
                                    margin-left: 5px;
                                    border-radius: 5px;
                                    background-color: #ef4f4f;
                                    &:active{
                                        background-color: #8f2f2f;
                                    }
                                }
                            }
                        }
                    }
                }
                .address-letter{
                    > div{
                        display: flex;
                        padding: 5px 0;
                        font-size: 18px;
                        p{
                            display: flex;
                            flex-direction: column;
                            span:last-child{
                                color: #666;
                                
                                padding-top: 3px;
                            }
                        }
                        i{
                            margin-right: 10px;
                        }
                    }
                }
                .info{
                    padding: 5px 0;
                    text-align: right;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    p{
                        .num{
                            font-size: 17px;
                        }
                        .time{
                            color: #ef4f4f;
                            font-size: 18px;
                        }
                    }
                }
                .order-btn{
                    > div{
                        display: flex;
                        justify-content: flex-end;
                        padding: 5px 0;
                        p{
                            margin: 0 5px;
                        }
                    }
                }
            }
        }
    }
    .popup{
        padding: 10px 0;
        text-align: center;
        color: #666;
        span{
            display: block;
        }
        .t{
            color: #ef4f4f;
            padding-bottom: 5px;
        }
    }
}
</style>