<template>
    <div class="list">
        <div class="list-wrap">
            <div  
                v-for="(item, index) in list_data"
                :key="index"
                class="list-item" @click.stop="handleRouter(item.goodId)">
                <div class="item-wrap">
                    <div class="pic">
                        <img :src="item.goodPic[0]" />
                    </div>
                    <span class="name">{{item.goodName}}</span>
                    <div class="price">
                        <p>
                            <span class="now">{{item.goodPrice}} ￥</span>
                            <span class="old line-center">{{item.goodOldPrice}} ￥</span>
                        </p>
                        <img @click.stop="aadCar(index)" src="./imgs/car.png">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{}
    },
    methods:{
        handleRouter(goodId){
            this.$router.push('/detail/'+goodId)
        },
        // 加入购物车
        aadCar(index){

            const {dispatch, state} = this.$store
            dispatch('addCar', {
                carGoodId: this.list_data[index].goodId,
                carUserId: state.userData.userId
            }) 
        }
    },
    props:{
        to:{
            type: String,
            default: ''
        },
        list_data:{
            type: Array,
            default: () => [],
        }
    }
}
</script>

<style lang="less" scoped>
.list{
    .list-wrap{
        overflow: hidden;
        .list-item{
            float: left;
            width: 50%;
            padding: 0 5px;
            margin-top: 10px;
            border-radius: 15px;
            overflow: hidden;
            box-sizing: border-box;
            .item-wrap{
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                padding-top: 10px;
                background-color: #fff;
                .name{
                    font-weight: 400;
                    font-size: 15px;
                    padding: 10px 10px 0;
                    color: #333;
                }
                .pic{
                    width: 80%;
                    height: auto;
                    overflow: hidden;
                    img{
                        display: block;
                        width: 160px;
                        height: 160px;
                    }
                }
                .price{
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    img{
                        width: 30px;
                        height: 30px;
                        margin-right: 5px;
                        margin-bottom: 5px;
                        border-radius: 50%;
                    }
                    p{
                        display: flex;
                        flex: 1;
                        font-size: 13px;
                        .now{
                            color: red;
                            padding: 0 10px;
                        }
                        .old{
                            position: relative;
                            color: #ccc;
                        }
                    }
                }
            }
        }
    }
}
</style>