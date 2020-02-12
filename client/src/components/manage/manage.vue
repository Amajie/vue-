<template>
    <div class="manage">
        <div class="manage-content">
            <div class="fixed">
                <Header title="超市管理" 
                    :left_icon="require('./imgs/left.png')"
                    :right_icon="$store.state.userData.userGrade? 
                        require('./imgs/typem.png'): ''"
                    @left_click="$router.replace('/person')"
                    @right_click="$router.push('/type')"
                    bgC="red" 
                />
            </div>
            <div class="edit" ref="editNode">
                <div class="edit-content">
                <div class="left-nav" ref="goodMenu">
                    <ul>
                        <li v-for="(item, index) in typeMenu" 
                            :key="index"
                            :class="{active: currentIndex === index }"
                            @click="selectLeft(index)"
                        >   
                            <span>{{item.typeText}}</span>
                        </li>

                    </ul>
                </div>
                <div class="right-list" ref="goodList">
                    <ul>
                        <li v-for="(item, index) in goodData" 
                            :key="index" ref="rItem">
                            <div class="title">
                                <span>{{item.typeText}}</span>
                            </div>
                            <div 
                                v-for="(val, i) in item.data" 
                                :key="i"
                                class="item-list"
                                @click.stop="toDetail(val)"
                            >
                                <div class="item-pic">
                                    <img :src="val.goodPic">
                                </div>
                                <div class="item-info">
                                    <!-- 标题 -->
                                    <div class="info-title">
                                        <span>{{val.goodName}}</span>
                                    </div>
                                    <!-- 第二行 价格加入购物车 -->
                                    <div class="price">
                                        <p>
                                            <span class="now">{{val.goodPrice}} ￥</span>
                                            <span v-if="val.goodOldPrice" class="old line-center">{{val.goodOldPrice}} ￥</span>
                                        </p>
                                        <p>
                                            <!-- 编辑和购物车切换 -->
                                            <img v-if="$store.state.userData.userGrade" 
                                                @click.stop="toEdit(val)" src="./imgs/edit.png">
                                            <img v-else 
                                                @click.stop="handleAddCar(val)"
                                                src="./imgs/car.png">
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                </div>
            </div>
        </div>

        <!-- 数据编辑 -->
        <div class="edit-good" v-show="editGoodFlag">
            <Add 
                @add-reject="handleReject"
                @add-resolve="handlereSolve"
                :editGoodFlag="editGoodFlag" 
                ref="addNode"    
            />
        </div>
        <!-- 数据添加 -->
        <div 
            @click="$router.push('/add')"
            v-show="!editGoodFlag && $store.state.userData.userGrade" class="add-good">
            <span>添加</span>
        </div>
    </div>
</template>

<script>
import Header from '../com/header.vue'
import Add from './child/add.vue'

import Bscroll from 'better-scroll'

export default {
    data(){
        return {
            goodData: [],
            typeData: [],
            typeMenu: [], // 有数据的分类
            editGoodFlag: false,
            currentEditData: {},//当前编辑的对象
            scrollY: 0,//获取实时滚动位置
            heightList: []//获取每一个li的高度
        }
    },
    methods:{

        // 编辑数据完成，设置最新数据
        handlereSolve({goodName, goodOldPrice, goodPrice, goodPic}){
            this.currentEditData.goodName = goodName
            this.currentEditData.goodOldPrice = goodOldPrice
            this.currentEditData.goodPrice = goodPrice
            this.currentEditData.goodPic = goodPic

            this.editGoodFlag = !this.editGoodFlag
        },

        // 处理获取的分类和商品数据
        handleData(goodData, typeData){
            

            typeData.forEach((item, index) =>{

                const googObj = {}
                const data = goodData.filter((val, i)=> item.typeId === val.goodTypeId)

                if(data.length){
                    googObj.data = data
                    googObj.typeText = item.typeText
                    this.goodData.push(googObj)
                    this.typeMenu.push(item)
                }

            })

            this.typeData = typeData
            this._scrollInit()
        },

        // 前往详情页
        toDetail(goodData){
            this.$router.push(`/detail/${goodData.goodId}`)
        },
        // 前往编辑
        toEdit(currentEditData){

            // 获取传递数据
            this.$store.commit('setState', {loading: true})
            const {goodId, goodTypeId}  = currentEditData
            this.$refs.addNode.getEditData(goodId, goodTypeId, this.typeData)
            // 界面切换 以及保存当前编辑数据
            this.editGoodFlag = !this.editGoodFlag
            this.currentEditData = currentEditData
        },

        // 取消编辑
        handleReject(){
            this.editGoodFlag = !this.editGoodFlag
        },

        //初始化 better-scroll
        _scrollInit(){

            this.$nextTick(() =>{
                this.menuList = new Bscroll(this.$refs.goodMenu, {
                    click: true
                })


                this.goodMenu = new Bscroll(this.$refs.goodList, {
                    probeType: 3,
                    click: true
                })



                this.goodMenu.on('scroll', (pos) =>{
                    //获取实时滚动的距离 使用scrollY接收     
                    this.scrollY = Math.abs(Math.round(pos.y))
                })

                // 初始化高度
                this.getHeight()
            })
        },

        // 获取高度
        getHeight(){

            // 数据为空 在往下执行
            if(!this.goodData.length) return

            this.heightList = []
            //获取每一个li的高度
            const lis = this.$refs.rItem

            //heightList的第一个元素为0
            let height = 0

            this.heightList.push(height)

            //之后的高度即为当前li的高度加上之前面li的高度和
            lis.forEach(item =>{
                height += (item.clientHeight-1)
                this.heightList.push(height)
            })

        },

        // 添加购物车
        handleAddCar(goodObj){
            const {dispatch, state} = this.$store
            dispatch('addCar', {
                carGoodId: goodObj.goodId,
                carUserId: state.userData.userId
            }) 
        },

        // 左侧导航栏点击
        selectLeft(index) {

            // 数据为空 在往下执行
            if(!this.goodData.length) return

            let rItem = this.$refs.rItem
            let el = rItem[index]
            this.goodMenu.scrollToElement(el, 1000)
        }
    },

    computed:{
        currentIndex(){
            const index = this.heightList.findIndex((item, index) =>{
                return this.scrollY >= this.heightList[index] && this.scrollY < this.heightList[index + 1]
            })

            return index > 0 ? index : 0
        }
    },

    created(){
        this.$store.dispatch('getTGData').then(res =>{
            if(res.code === 200){
                this.handleData(res.goodData, res.typeData)
            }
        })
    },
    components:{
        Header,
        Add
    }
}
</script>

<style lang="less" scoped>
.manage{
    height: 100%;
    .manage-content{
        .fixed{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
        }
        .edit{
            position: fixed;
            top: 40px;
            left: 0;
            width: 100%;
            height: 100%;
            .edit-content{
                display: flex;
                height: 100%;
                ul{
                    padding-bottom: 110px;
                    li::after{
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 200%;
                        transform-origin: 0 0;
                        transform: scale(0.5, 0.5);
                        border: 1px solid #ccc;
                    }
                }
                .left-nav{
                    height: 100%;
                    margin-top: 5px;
                    background-color: #f4f4f4;
                    overflow-y: auto;
                    ul{
                        li{
                            padding: 15px;
                            font-size: 16px;
                            text-align: center;
                            position: relative;
                        }
                        .active{
                            background-color: #fff;
                        }
                    }
                }
                .right-list{
                    flex: 1;
                    height: 100%;
                    overflow-y: auto;
                    ul{
                        li{
                            padding: 5px;
                            position: relative;
                            .title{
                                text-align: center;
                                padding: 10px 0;
                                font-size: 18px;
                            }
                            .item-list{
                                display: flex;
                                margin: 5px 0;
                                .item-pic{
                                    margin-right: 5px;
                                    img{
                                        width: 60px;
                                        height: 60px;
                                    }
                                }
                                .item-info{
                                    display: flex;
                                    flex: 1;
                                    flex-direction: column;
                                    .info-title{
                                        font-size: 17px;
                                        line-height: 20px;
                                        margin-bottom: 5px;
                                    }
                                    .price{
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        padding: 5px 0;
                                        p{
                                            font-size: 15px;
                                            .now{
                                                color: red;
                                                margin-right: 10px;
                                            }

                                            .old{
                                                position: relative;
                                            }
                                            img{
                                                width: 30px;
                                                height: 30px;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .add-good{
        position: fixed;
        right: 0;
        bottom: 60px;
        background-color: #ef4f4f;
        z-index: 1;
        padding: 10px 5px;
        border-radius: 5px 0 0 5px;
        span{
            color: #fff;
            
        }
    }
    .edit-good{
        position: relative;
        z-index: 2;
        height: 100%;
        background-color: #fff;
    }
}
</style>