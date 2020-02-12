<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        
        <router-view v-if="!$route.meta.keepAlive" />

        <div class="tabbar" v-show="show_tabbar">
            <mt-tabbar v-model="selected">
                <mt-tab-item id="home">
                    <img slot="icon" src="./assets/home/tab_home.png">
                    首页
                </mt-tab-item>
                <mt-tab-item id="manage">
                    <img slot="icon" src="./assets/home/tab_type.png">
                    分类
                </mt-tab-item>
                <mt-tab-item id="car">
                    <img slot="icon" src="./assets/home/tab_car.png">
                    购物车
                </mt-tab-item>
                <mt-tab-item id="person">
                    <img slot="icon" src="./assets/home/tab_person.png">
                    个人中心
                </mt-tab-item>
            </mt-tabbar>
        </div>
        <div v-if="loading" class="loading">
            <div class="l">
                <img src="./assets/home/loading.png">
                <p>玩命加载中...</p>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{
            selected: sessionStorage.getItem('selected')? 
                sessionStorage.getItem('selected'): 'home',
            isSelect: true // 是否为 非tabbar跳转到tabbar
        }
    },
    computed:{
        ...mapState([
            'show_tabbar',
            'loading',
            

        ])
    },
    methods:{
        // 保存 tabbar记录
        selectSave(){
            sessionStorage.setItem('selected', this.selected)
            sessionStorage.setItem('state', JSON.stringify(this.$store.state))
        }
    },
    created(){
        const tab_path = this.$route.meta.tab_path
        if(tab_path){
            this.selected = tab_path
        }
    },
    mounted(){
        window.addEventListener('unload', this.selectSave)
    },

    watch:{
        selected(val){
            this.isSelect && this.$router.push(`/${val}`)
            this.isSelect = true
        },
        $route(val, old){

            // 如果为非tab跳转tab 以及跳转的tab不能等于上一次的tab
            if(val.meta.tab_path && !old.meta.tab_path && val.meta.tab_path != this.selected){
                this.isSelect = false
                this.selected = val.meta.tab_path
            }
        }
    }
}
</script>

<style lang="less" scoped>
#app{
    height: 100%;
    .tabbar{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        .tab-badge{
            position: absolute;
            right: 0;
            top: 0;
            margin: 3px;
        }
    }
    .loading{
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        background: #fff;
        .l{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            img{
                display: block;
                width: 50px;
                height: 50px;
                margin: 0 auto;
                animation: loading 1s linear infinite;
            }
            p{
                padding: 5px 0;
            }
        }

        @keyframes loading {
            from{
                transform: rotate(0deg)
            }
            to{
                transform: rotate(360deg)
            }
        }
    }
}
</style>