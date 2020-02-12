<template>
    <div class="file-order">
        <div v-show="!isSelect" class="file-order-content">
            <Header 
                :left_icon="require('./imgs/left.png')"
                @left_click="toCar"
                title="填写订单"/>
            <div @click="handleGetddress" class="select-address">
                <div class="address-wrap">
                    <div class="l">
                        <img v-if="!orderAddress" src="./imgs/add.png" />
                        <p class="address-info" v-if="orderAddress">
                            <span class="t">{{orderName}} {{orderPhone}}</span>
                            <span class="b">{{orderAddress}}</span>
                        </p>
                        <span v-else>选择收货地址</span>
                    </div>
                    <img class="r" src="./imgs/right.png" />
                </div>
            </div>
            <OrderList :orderData="orderData"  />
            <div class="total-info">
                <mt-cell title="总金额" :value="totalPrice+'￥'" />
                <mt-cell title="件数" :value="totalNum+'件'" />
            </div>
            <div class="btn">
                <mt-button @click.native="checkOrder" size="large" type="danger">提交订单</mt-button>
            </div>
        </div>
        <MyAddress 
            v-show="isSelect"
            @select-address="seleceAddress"
            @close-select="handleChange"
            :select="true"
            ref="addressNode"
        />
    </div>
</template>
<script>
import Header from '../com/header.vue'
import OrderList from '../com/orderlist.vue'
import MyAddress from '../address/address.vue'
import {Toast, MessageBox} from 'mint-ui'
export default {
    data(){
        return {
            orderData: [],
            totalPrice: 0,
            totalNum: 0,
            isSelect: false,
            orderName: '',
            orderPhone: '',
            orderAddress: '',
        }
    },
    methods:{

        // 获取地址 传递给子组件
        seleceAddress(item){
            this.orderName = item.aName
            this.orderPhone = item.aPhone
            this.orderAddress = item.address
            this.isSelect = false
        },

        // 确认是否提交订单
        checkOrder(){
            const{ submitOrder, orderAddress, MessageBox} = this

            if(!orderAddress) return Toast('请选择收货地址')

            MessageBox.confirm('是否提交订单？').then(res =>{
                submitOrder()
            },() =>{})

        },

        // 提交订单
        submitOrder(){

            const{orderData, orderName, orderPhone, Toast, MessageBox,
                orderAddress, $store, $router, toCar} = this

            $store.dispatch('order', {
                orderName, orderPhone, orderAddress,
                orderUserId: $store.state.userData.userId,
                orderData
            }).then(res =>{
                if(res.code === 200){
                    MessageBox.alert('下单成功，等待收货吧').then(res =>{
                        // 前往购物车
                        toCar()
                    })
                }
            })
        },
        // 界面切换 
        handleChange(){
            this.isSelect = !this.isSelect
        },

        // 前往购物车
        toCar(){
            this.$router.replace('/car')
            sessionStorage.removeItem('fillOrderObj')
        },
        // 选择地址
        handleGetddress(){
            this.isSelect = !this.isSelect
            
            this.$refs.addressNode.getAllAddress()
        }
    },

    created(){

        // 这里就不再跳转到出错页面 直接弹窗提示即可
        if(sessionStorage.getItem('fillOrderObj')){
            const fillOrderObj = JSON.parse(sessionStorage.getItem('fillOrderObj'))
            this.orderData = fillOrderObj.orderData
            this.totalPrice = fillOrderObj.totalPrice
            this.totalNum = fillOrderObj.totalNum
        }else{
            return this.MessageBox.alert('请先提交订单')
            .then(() =>{
                this.$router.replace('/car')
            })
        }

        this.$store.dispatch('getAddress', {
            aUserId: this.$store.state.userData.userId,
            aInit: 1,
        }).then(res =>{
            if(res.code === 200 && res.addressData[0]){
                this.orderName = res.addressData[0].aName
                this.orderPhone = res.addressData[0].aPhone
                this.orderAddress = res.addressData[0].address
            }
        })
    },
    components:{
        Header,
        OrderList,
        MyAddress
    }
}
</script>

<style lang="less" scoped>
.file-order{
    height: 100%;
    background-color: #f3f3f3;
    .file-order-content{
        height: 100%;
        > div{
            background-color: #fff;
        }
        .select-address{
            border-bottom: 2px dotted #007fff;
            &:active{
                background-color: #fafafa;
            }
            .address-wrap{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 10px;
                .l{
                    display: flex;
                    align-items: center;
                    img{
                        width: 40px;
                        height: 40px;
                        margin-right: 10px;
                    }
                    .address-info{
                        display: flex;
                        font-size: 18px;
                        flex-direction: column;
                        .b{
                            font-size: 16px;
                            color: #666;
                        }
                    }
                }
                .r{
                    width: 20px;
                    height: 20px;
                }
            }
        }
        .total-info{
            margin: 5px 0;
        }
        .btn{
            margin: 5px 0;
        }
    }
}
</style>