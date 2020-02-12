<template>
    <div class="person">
        <div class="person-content">
            <Header 
                title="个人中心"
                bgC="#00d3be"
                right_text="退出"
                @right_click="logout"
            />
            <div class="person-wrap">
                <router-link to="/set" tag="div" class="person-t">
                    <img :src="$store.state.userData.avater" >
                    <span>
                        {{$store.state.userData.userName}}
                        {{$store.state.userData.userGrade?'(老板)': ''}}
                    </span>
                </router-link>
                <div class="person-c">
                    <div class="order-cell">
                        <mt-cell
                            title="我的订单"
                            to="/order/5"
                            is-link
                            value="查看更多订单">
                        </mt-cell>
                    </div>
                    <div class="order-list">
                        <div class="list-wrap">
                            <router-link tag="div" to="/order/1" class="item">
                                <img src="./imgs/f.png">
                                <span>
                                    待发货
                                </span>
                            </router-link>
                            <router-link tag="div" to="/order/2" class="item">
                                <img src="./imgs/s.png">
                                <span>
                                    待收货
                                </span>
                            </router-link>
                            <router-link tag="div" to="/order/3" class="item">
                                <img src="./imgs/p.png">
                                <span>
                                    待评价
                                </span>
                            </router-link>
                            <router-link tag="div" to="/order/4" class="item">
                                <img src="./imgs/h.png">
                                <span>
                                    售后/退款
                                </span>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="person-b">
                    <mt-cell
                        title="我的收货地址"
                        to="/address"
                        is-link>
                    </mt-cell>
                    <mt-cell
                        title="联系客服"
                        @click.native="Toast('请在服务时间内拨打热线')"
                        is-link
                        value="8:00 ~ 22:00">
                    </mt-cell>
                    <mt-cell
                        title="意见反馈"
                        @click.native="Toast('意见反馈')"
                        is-link>
                    </mt-cell>
                    <mt-cell
                        title="关于我"
                        @click.native="Toast('关于我')"
                        is-link>
                    </mt-cell>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Header from '../com/header.vue'
export default {
    data(){
        return {

        }
    },
    methods:{
        logout(){
            this.MessageBox.confirm('是否退出当前账号？')
            .then(
                action => this.$store.commit('delectData')
            ).catch(() =>{})
        }
    },
    components:{
        Header
    }
}
</script>

<style lang="less" scoped>
.person{
    height: 100%;
    .person-content{
        min-height: 100%;
        padding-bottom: 70px;
        background-color: #e0e0e0;
        .person-wrap{
            .person-t{
                display: flex;
                padding: 20px 0;
                align-items: center;
                background-color: #00d3be;
                img{
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin: 0 20px;
                }
                span{
                    color: #fff;
                    font-size: 20px;
                }
            }
            .person-c{
                background-color: #fff;
                margin-bottom: 10px;
                .order-list{
                    padding: 10px;
                    .list-wrap{
                        display: flex;
                        .item{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                            flex: 1;
                            img{
                                width: 45px;
                                height: 45px;
                                border-radius: 50%;
                            }
                            span{
                                font-size: 13px;
                                padding: 8px 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>