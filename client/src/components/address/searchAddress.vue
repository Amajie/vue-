<template>
    <div class="search-address">
        <div class="search-address-wrap">

            <div class="fixed-top">
                <!-- 选择 -->
                <div class="search-address-title">
                    <div @click="getCityData" class="city">
                        <span>{{cityName? cityName:'选择城市'}}</span>
                        <img src="./imgs/more.png">
                    </div>
                    <div class="city-address">
                        <input @input="handleSearch" placeholder="请输入关键字搜索" v-model="keyWord" />
                    </div>
                    <div class="reject-btn" @click="rejectSelect">
                        <span>取消</span>
                    </div>
                </div>
            </div>
            <!-- 城市名字 -->
            <div class="ci" v-show="!cityId">
                <div>
                    <mt-index-list>
                        <mt-index-section 
                            v-for="(item, key, index) in cityData"
                            :key="index"
                            :index="key">
                            <mt-cell
                                v-for="(obj, i) in item"
                                :key="i"
                                @click.native="handlClickCity(obj)"
                                :title="obj.name"
                            ></mt-cell>
                        </mt-index-section>
                    </mt-index-list>
                </div>
            </div>
            <!-- 搜索地址 -->
            <div class="ad" v-show="addressData.length">
                <mt-cell 
                  v-for="(item, index) in addressData"
                    :key="index"
                    @click.native="$emit('get-address',item.address)"
                    :title="item.name" :label="item.address" is-link></mt-cell>
            </div>
        </div>
    </div>
</template>
<script>
import {MessageBox} from 'vuex'
export default {
    data(){
        return{
            city: '',
            keyWord: '',
            cityData: {},
            addressData: [], // 具体地址数据
            cityName: '',
            cityId: ''
        }
    },
    created(){
        this.$store.dispatch('getCity').then(res =>{
            if(res.code === 200) return this.cityData = res.cityData
        })
    },
    methods:{

        // 清空数组 城市会马上显示
        getCityData(){
            this.addressData = []
            this.cityId = ''
            this.keyWord= ''
        },
        
        
        // 搜索地址
        handleSearch(){

            let {cityId, keyWord,$store} = this

            if(!cityId) return this.MessageBox.alert('您还没选择城市')

            $store.dispatch('getCityAddress',{
                id: cityId, keyWord: keyWord
            }).then(res =>{
                this.addressData = res
            })
        },

        // 取消选择
        rejectSelect(){
            this.$emit('close')
            this.addressData = []
            this.cityId = ''
            this.cityName= ''
        },

        // 获取城市
        handlClickCity(obj){
            this.cityId = obj.id
            this.cityName = obj.name
        }
    },
    props:{
        'get-address': Function,
        'close': Function
    }
}
</script>

<style lang="less" scoped>
.search-address{
    height: 100%;
    .search-address-wrap{
        height: 100%;
        .fixed-top{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 9999999999;
            .search-address-title{
                display: flex;
                background-color: #ffc100;
                align-items: center;
                padding: 10px 0;
                .city{
                    display: flex;
                    font-size: 15px;
                    padding-left: 10px;
                    color: #fff;
                    align-items: center;
                    img{
                        width: 20px;
                        height: 20px;
                    }
                }
                .city-address{
                    flex: 1;
                    input{
                        outline: none;
                        border: none;
                        width: 100%;
                        font-size: 15px;
                        height: 25px;
                        text-indent: 10px;
                        border-radius: 5px;
                    }
                }
                .reject-btn{
                    font-size: 17px;
                    color: #fff;
                    padding: 3px 10px;
                }
            }
        }
        .ci{
            position: fixed;
            top: 50px;
            left: 0;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            padding-bottom: 60px;
        }
        .ad{
            margin-top: 50px;
        }
    }
}
</style>