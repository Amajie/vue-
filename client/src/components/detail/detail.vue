<template>
    <div class="detail">
        <Header 
            @left_click="backHome"
            @right_click="$router.replace('/car')"
            fixed
            :left_icon="require('./imgs/left.png')" 
            right_text="我的" 
            title="详情页"/>
        
        <!-- 轮播图 -->
        <div class="detail-content">
            <!-- 显示手杖图片 -->
            <div  class="detail-img" @click="handle_show_big" >
                <img  
                    ref="first_img" :class="{scleM: scleFlag}" 
                    :src="goodObj.goodPic ? goodObj.goodPic[0]:''" >
            </div>
            <!-- 立即购买 -->
            <div class="group-buy">
                <div class="group-wrap">
                    <div class="detail-price">
                        <p class="now">
                            <span class="p">{{goodObj.goodPrice}}</span>
                            元 
                            <span class="o">{{goodObj.goodOldPrice}}元</span>
                        </p>
                    </div>
                    <div @click="handleAddCar" class="buy">
                        <span class="btn-b">加入购物车</span>
                    </div>
                </div>
            </div>

            <!-- 说明 -->
            <div class="sell">
                <p class="l">
                    <img src="./imgs/m.png">
                    <span>不满意可退款</span>
                </p>
                <p class="n">
                    <img src="./imgs/f.png">
                    <span>已销售{{goodObj.goodSell}}份</span>
                </p>
            </div>
            <!-- 评价 -->
            <div class="commit">
                <div class="commit-title">
                    <span class="h">评价</span>
                </div>
                <Commit v-if="commitData.length" :commitData="commitData" />
                <NoData v-else info="暂无人评论" />
            </div>
        </div>

        <!-- 大图片显示 -->
        <div v-show="show_big" @click="show_big = false" class="big-swiper">
            <div class="detail-swiper">
                <div class="swiper-wrapper">
                    <!-- 这里到时候 会使用router-link 跳转 -->
                    <div 
                        v-for="(item, index) in goodObj.goodPic"
                        :key="index"
                        class="swiper-slide">
                        <img :src="item" >
                    </div>
                </div>
                <!-- 如果需要分页器 -->
                <div class="swiper-pagination"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../com/header.vue'
import Commit from '../com/commit.vue'
import NoData from '../com/noData.vue'
// 引入swiper
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
export default {
    data(){
        return {
            scleFlag: false,// 是否需要放大图片
            show_big: false,// 是否查看大图片
            goodObj: {}, // 商品数据
            commitData: []
        }
    },
    methods:{
        backHome(){
            this.$router.go(-1)
        },

        // 显示大图片
        handle_show_big(){
            this.show_big = true
            this.$nextTick(() =>{
                // swiper
                const mySwiper = new Swiper('.detail-swiper', {
                    // loop: true, // 循环模式选项
                    // autoplay: true,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction'
                    },
                })  
            })
        },

        // 添加购物车
        handleAddCar(){
            const {dispatch, state, goodObj} = this.$store
            dispatch('addCar', {
                carGoodId: this.goodObj.goodId,
                carUserId: state.userData.userId
            }) 
        }
    },

    created(){

        let goodId = this.$route.params.goodId

        this.$store.dispatch('getGood', {goodId})
        .then(res =>{
            const {code, goodObj} = res

            // 有数据
            if(code === 200) return this.goodObj = goodObj

            // 无数据 跳转到错误页面
            this.$router.replace('/wrong')
        })


        // 与用户信息一起获取
        this.$store.dispatch('getCommit', {commitGoodId: goodId})
        .then(res =>{
            const {code, commitData} = res
            if(code === 200){

                commitData.forEach((item, index) =>{
                    commitData[index].commitPic = item.commitPic.split(',')[0]? item.commitPic.split(',') : []
                })

                this.commitData = commitData
            }
        })
    },
    mounted(){
        // 只有 图片高度不够才放大
        this.$nextTick(() =>{
            this.scleFlag = this.$refs.first_img.clientHeight < 170
        })
    },
    components:{
        Header,
        Commit,
        NoData
    }
}
</script>

<style lang="less" scoped>
.detail{
    .detail-content{
        overflow: hidden;
        margin-top: 40px;
        .detail-img{
            height: 170px;
            overflow: hidden;
            img{
                width: 100%;
            }
            .scleM{
                transform: scale(1.5);
            }
        }
        .group-buy{
            border-bottom: 1px solid #e0e0e0;
            padding: 10px 0;
            .group-wrap{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .detail-price{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .now{
                        padding: 0 10px;
                        .p{
                            font-size: 30px;
                            color: #06c1ae;
                            font-weight: 700;
                        }
                        .o{
                            position: relative;
                            color: #ccc;
                            margin-left: 10px;
                            &::before{
                                content: '';
                                position: absolute;
                                top: 50%;
                                width: 200%;
                                transform-origin: 0 0;
                                transform: scale(0.5, 0.5);
                                border: 1px solid #ccc;
                            }
                        }
                    }
                }
                .buy{
                    margin-right: 20px;
                    .btn-b{
                        background-color: red;
                        border: none;
                        color: #fff;
                        font-size: 12px;
                        padding: 10px 10px;
                        border-radius: 10px;
                        &:active{
                            background-color: #f9cc9d;
                        }
                    }
                }
            }
        }
        .sell{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
            p{
                display: flex;
                align-items: center;
                img{
                    width: 20px;
                    height: 20px;
                    margin: 0 5px;
                    border-radius: 50%;
                    
                }
                span{
                    color: #6bbd00;
                }
            }
        }
        .commit{
            .commit-title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                font-size: 17px;
            }
        }
    }
    .big-swiper{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.8);
        > div{
            width: 100%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            overflow: hidden;
            img{
                width: 100%;
            }
        }
    }
}
</style>