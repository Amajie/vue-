<template>
    <div class="ince-address">
        <div v-show="!isSearch" class="ince-address-wrap">
            <Header 
            :left_icon="require('./imgs/left.png')"
            :right_icon="require('./imgs/address.png')"
            @left_click="$router.go(-1)"
            @right_click="isSearch = !isSearch"
            :title="title" />
            <div class="in">
                <mt-field label="收货人" placeholder="请输入收货人姓名" v-model="aName" />
                <mt-field label="收货人电话" placeholder="请输入收货人电话" v-model="aPhone" />
                <mt-field label="收货地址" placeholder="请输入收货地址" v-model="address" />
            </div>
            <div>
                <mt-button size="large" type="danger" @click="handleAddress">保存</mt-button>
            </div>
            <div class="zy">
                注意：<span>可点击+号搜索地址，但是接口是别人的，有可能不能访问，手动输入即可</span>
            </div>
        </div>
        <SeachAddress @close="closeSearch" @get-address="getAddress" v-show="isSearch" />
    </div>
</template>
<script>
import Header from '../com/header.vue'
import SeachAddress from './searchAddress.vue'
export default {
    data(){
        return{
            title:"添加地址",
            aName: '',
            address: '',
            aPhone: '',
            aId: '',
            isSearch: false
        }
    },

    methods:{

        // 发送请求
        handleAddress(){
            const {Toast, aId, address, aName, aPhone, $store} = this
            if(!aName){
                return Toast('请输入名字')
            }else if(!aPhone){
                return Toast('请输入手机号')
            }else if(!address){
                return Toast('请选择地址或者输入地址')
            }

            $store.dispatch('address',{
                    aId,
                    address,
                    aName,
                    aPhone,
                    aUserId: 'b93318e1bfc218aba0c919415e8c4879'
            }).then(res =>{
                if(res.code === 200){
                    Toast('操作成功')
                }
            })
        },
        // 获取地址
        getAddress(address){
            this.address = address
            this.isSearch = false
        },
        closeSearch(){
            this.isSearch = false
        }
    },
    created(){
        // 获取选择的地址
        const {$route} = this

        // 判断是否是选择地址
        if($route.params.pathMatch){
            // 获取aId值
            this.aId = $route.params.pathMatch.split('/')[1]
            // 发送请求获取数据
            this.$store.dispatch('getAddress',{
                aId: $route.params.pathMatch.split('/')[1]
            }).then(res =>{
                if(res.code === 200){
                    this.aName = res.addressData[0].aName
                    this.address = res.addressData[0].address
                    this.aPhone = res.addressData[0].aPhone
                }
            })
        }
    },
    components:{
        Header,
        SeachAddress
    }

}
</script>

<style lang="less" scoped>
.ince-address{
    .ince-address-wrap{
        .zy{
            padding: 10px;
            span{
                color: red;
            }
        }
    }
}
</style>