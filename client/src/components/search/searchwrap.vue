<template>
    <div class="search">
        <div class="search-content">
            <div class="header">
                <div @click="backHome" class="b">
                    <img src="./imgs/left.png" />
                </div>
                <div class="search">
                    <input v-model="keyWord" placeholder="请输入关键字">
                </div>
                <div @click="getSearch" class="right">
                    <span>搜索</span>
                </div>
            </div>
            <div class="search-wrap" id="" ref="searchList">
                <div class="wrap">
                    <List :list_data="searchData" />
                    <NoData v-if="!searchData.length" />
                    <p class="no-more" 
                        @click="getMore"
                        v-else>{{noText}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import NoData from '../com/noData.vue'
import List from '../com/list.vue'
import {Toast, MessageBox} from 'mint-ui'
export default {
    data(){
        return {
            keyWord: '',
            searchData: [],
            limit: 0,
            offset: 6,
            noData: false,
            noText: '',
            scrollTop: 0
        }
    },
    methods:{
        // 前往首页
        backHome(){
            // 初始化数据
            Object.assign(this.$data, this.$options.data())
            this.$router.replace('/home')
        },
        // 处理搜索
        getSearch(){
            this.limit = 0
            this.handleSearch()
        },
        // 搜索
        handleSearch(){
            const {$store, keyWord, Toast, limit, offset} = this

            if(!keyWord) return Toast('请输入关键字')
            $store.dispatch('search', {
                keyWord, 
                limit, 
                offset
            }).then(res =>{
                const {code, searchData} = res

                // 如果第一次搜索置为空
                if(!limit){
                    this.searchData = []
                }

                if(code === 200){
                    this.searchData = this.searchData.concat(searchData)
                    this.noText= '点击加载更多...'
                    this.noData = true
                }
                if(searchData.length < offset){
                    this.noText= '没有更多了'
                    this.noData = false
                }
            })
        },
        // 加载更多
        getMore(){
            if(!this.noData) return

            this.handleSearch()
        },
        // 滚动事件
        _scroll(ev){
            this.scrollTop = this.$refs.searchList.scrollTop
        }
    },
    mounted(){
        this.$refs.searchList.addEventListener('scroll', this._scroll)
    },

    // 进入
    beforeRouteEnter (to, from, next) {
        next(vm =>{
            // 初始化滚动条
            if(from.name === 'Detail'){
                vm.$refs.searchList.scrollTop = vm.$store.state.searchTop
            }else if(from.name === 'Home'){
                // 设置滚动条为初始值 0
                vm.$store.commit('setState', {searchTop: 0})
            }
        })
    },
    watch:{
        searchData(){
            this.limit +=1
        },
        scrollTop(searchTop){
            this.$store.commit('setState', {searchTop})
        }
    },
    components:{
        List,
        NoData
    }
}
</script>

<style lang="less" scoped>
.search{
    height: 100%;
    .search-content{
        height: 100%;
        .header{
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 999;
            display: flex;
            padding: 8px 0;
            background-color: #ffc100;
            justify-content: space-between;
            align-items: center;
            .b{
                img{
                    display: block;
                    width: 30px;
                    height: 30px;
                    margin: auto 0;
                }
            }
            .search{
                flex: 1;
                overflow: hidden;
                border-radius: 10px;
                input{
                    width: 100%;
                    height: 100%;
                    border: 0;
                    padding: 5px;
                    background-color: #fff;
                    outline: none;
                }
            }
            .right{
                height: 100%;
                padding: 0 5px;
                font-size: 17px;
                span{
                    color: #fff;
                }
            }
        }
        .search-wrap{
            position: fixed;
            top: 45px;
            left: 0;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            .wrap{
                padding-bottom: 50px;
            }
        }
    }
}
</style>