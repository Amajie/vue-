<template>
    <div class="fill-list">
        <div 
            v-for="(item, index) in orderData"
            :key="index"
            :class="{'fill-item': true, line: border}">
            <div class="fill-info">
                <img :src="item.goodPic" />
                <div class="i">
                    <span class="t">{{item.goodName}}</span>
                    <span class="p">{{item.goodPrice}}￥ x {{item.carNum}}件</span>
                </div>
            </div>
            <div class="commit-c">
                <mt-field placeholder="备注" :disableClear="true" type="textarea" rows="1" v-model="item.oGoodLetter" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
        }
    },
    methods:{

    },
    props:{
        orderData: Array,
        border:{
            type: Boolean,
            default: true
        },
        default: () => []
    }

}
</script>

<style lang="less" scoped>
.fill-list{
    margin-top: 5px;
    .fill-item{
        display: flex;
        flex-direction: column;
        .fill-info{
            display: flex;
            position: relative;
            padding: 10px;
            > img{
                width: 50px;
                height: 50px; 
            }
            .i{
                display: flex;
                flex: 1;
                flex-direction: column;
                padding-left: 10px;
                .t{
                    padding: 5px;
                    font-size: 15px;
                }
                .p{
                    padding-right: 20px;
                    text-align: right;
                }
            }
        }
    }
}
</style>