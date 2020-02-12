<template>
    <div class="home">
        <div class="header">
            <router-link to="/search" tag="div" class="search">
                <img src="./imgs/search.png">
                <span>请输入菜名</span>
            </router-link>
            <div @click="$router.push('/set')" class="count">
                <img :src="$store.state.userData.avater">
            </div>
        </div>
        <div class="home-wrap">
            <div class="home-swiper">
                <div class="item-swiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <img src="./imgs/swiper1.jpg" />
                        </div>
                        <div class="swiper-slide">
                            <img src="./imgs/swiper2.jpg" />
                        </div>
                        <div class="swiper-slide">
                            <img src="./imgs/swiper3.jpg" />
                        </div>
                    </div>
                    <!-- 如果需要分页器 -->
                    <div class="swiper-pagination"></div>
                </div>
            </div>
            <!-- 这里要封装成一个组件 -->
            <div class="recommend">
                <h1 class="title">热门推荐</h1>
                <List :list_data="homeData" />
                <NoData v-if="!homeData.length" info="没有首页数据" />
                <p v-else class="m">没有更多了</p>
            </div>
            <div class="footer">
            </div>
        </div>
    </div>
</template>
<script>

import List from '../com/list.vue'
import NoData from '../com/noData.vue'
// 引入swiper
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
export default {
    data(){
        return {
            homeData: []
        }
    },
    created(){
        // 获取首页数据
        this.$store.dispatch('getHome').then(res =>{
            const {code, homeData} = res
            if(code === 200){
                this.homeData = homeData
            }
        })
    },

    mounted(){
        this.$nextTick(() =>{
            // swiper
            const mySwiper = new Swiper('.item-swiper', {
                loop: true, // 循环模式选项
                autoplay: true,
                pagination: {
                    el: '.swiper-pagination'
                },
            })  
        })
    },
    components:{
        List,
        NoData
    }
}
</script>

<style lang="less" scoped>
.home{
    // 头部
    height: 100%;
    .header{
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 999;
        box-sizing: border-box;
        display: flex;
        padding: 10px;
        background-color: #ffc100;
        justify-content: space-between;
        .search{
            display: flex;
            flex: 1;
            margin-right: 5px;
            background-color: #fff;
            border-radius: 10px;
            justify-content: center;
            align-items: center;
            &:active{
                background-color: #f0efed;
            }
            img{
                margin: 0 5px;
                width: 20px;
                height: 20px;
            }
            span{
                flex: 1;
                font-size: 13px;
                overflow: hidden;
            }
        }
        .count{
            img{
                margin-top: 2px;
                width: 26px;
                height: 26px;
                border-radius: 50%;
            }
        }
    }
    .home-wrap{
        margin-top: 55px;
        min-height: 100%;
        background-color: #e0e0e0;
        padding-bottom: 100px;
        .home-swiper{
            background-color: #fff;
            .item-swiper{
                position: relative;
                width: 100%;
                height: 150px;
                overflow: hidden;
                .swiper-wrapper{
                    width: 100%;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        .recommend{
            .title{
                font-size: 17px;
                font-weight: 300;
                padding: 5px;
                background-color: #fff;
            }
            .m{
                text-align: center;
                padding: 15px 0;
            }
        }
    }
}
</style>