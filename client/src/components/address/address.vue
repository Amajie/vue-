<template>
    <div class="address">
        <div class="address-wrap">
            <Header 
                v-if="!select"
                :left_icon="require('./imgs/left.png')"
                :right_icon="require('./imgs/add.png')"
                @left_click="$router.go(-1)"
                @right_click="$router.push('/ince')"
                title="我的地址" />
            <Header 
                v-else
                :left_icon="require('./imgs/left.png')"
                @left_click="$emit('close-select')"
                title="选择收货地址" />
            <div class="address-list">
                <div 
                    v-for="(item, index) in addressData"
                    :key="index"
                    @click="select? $emit('select-address', item): handleClick(item, index)"
                    class="address-item">
                    <mt-cell  :label="item.address" :title="item.aName+' '+item.aPhone">
                        <span v-show="item.aInit">默认</span>
                    </mt-cell>
                </div>
                <NoData v-if="!addressData.length" />
                <p class="no-more" v-else>{{noText}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import Header from '../com/header.vue'
import NoData from '../com/noData.vue'
export default {
    data(){
        return{
            addressData: [],
            value: '',
            noText: ''
        }
    },
    methods:{
        handleClick(data, index){

            !data.aInit && this.MessageBox.confirm('是否设置为默认地址？').then(
                action =>{
                    this.$store.dispatch('address', {
                        aId: data.aId, 
                        aInit: 1
                    }).then(res =>{
                        if(res.code === 200){
                            this.handleInit(index)
                        }
                    })
                },
                () =>{}
            )

        },

        // 获取地址
        getAllAddress(){

            this.$store.dispatch('getAddress', {
                aUserId: this.$store.state.userData.userId
            }).then(res =>{
                if(res.code === 200){
                    this.addressData = res.addressData
                    this.noText = '没有更多了'
                }
            })
        }, 

        // 改变默认地址
        handleInit(index){

            this.Toast('设置成功')
            // 查询原来的默认地址索引
            const i = this.addressData.findIndex(item => item.aInit)

            // 设置为默认地址
            this.$set(this.addressData, index, {...this.addressData[index], aInit: 1})
            
            i != -1? this.$set(this.addressData, i, {...this.addressData[i], aInit: 0}): ''

        }
    },
    props:{
        'select-address': Function,
        'close-select': Function,
        select: Boolean
    },
    created(){
        // 因为该组件在订单组件有复用 那边复用 不需要获取 点击在获取即可
        // 因此这里判断一下        
        this.$route.name === 'Address' && this.getAllAddress()
    },
    components:{
        Header,NoData
    }
}
</script>

<style lang="less" scoped>
.address{
    .address-wrap{
        .address-list{
            .address-item{
                padding: 5px 0;
            }
        }
    }
}
</style>