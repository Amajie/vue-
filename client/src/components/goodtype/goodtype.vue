<template>
    <div class="type">
        <Header title="所有分类"
            :fixed="true"
            right_text="添加"
            :left_icon="require('./left.png')"
            @left_click="$router.go(-1)"
            @right_click="handleAdd"
            bgC="red" 
        />
        <div class="type-content" ref="typeList">
            <div class="type-wrap">
                <div 
                    class="type-item"
                    v-for="(item, index) in typeData" 
                    :key="index">
                    <mt-cell
                        :title="item.typeText">
                        <img class="type-ico" slot="icon" :src="item.typePic" >
                        <mt-button @click.native="handleEdit(item.typeId)" type="primary" size="small">编辑</mt-button>
                        <mt-button @click.native="handleDelect(item.typeId, index)" type="danger" size="small">删除</mt-button>
                    </mt-cell>
                             
                </div>
                <NoData v-if="!typeData.length" />
                <p class="no-more" v-else>没有更多了</p>
            </div>
            
        </div>
    </div>
</template>

<script>
import Header from '../com/header.vue'
import NoData from '../com/noData.vue'

export default {
    data(){
        return {
            typeData:[]
        }
    },
    methods:{
        handleDelect(typeId, index){

            const {MessageBox, $store, Toast, typeData} = this

            MessageBox.confirm ('是否删除分类').then(action => {
                // 发送请求 3 为删除操作
                $store.dispatch('goodType', {
                    params: {typeId, op: 3}
                }).then(res =>{
                    const {code} = res.data
                    if(code === 200){
                        typeData.splice(index, 1)
                        Toast('删除成功')
                    }
                })
            }).catch(() =>{})
        },
        handleEdit(typeId){
           this.$router.push('/ea/'+typeId)
        },
        handleAdd(){
            this.$router.push('/ea')
        }
    },
    mounted(){
        
        this.$store.dispatch('goodType', {
            params:{
                limit: 0,
                offset: 20
            }
        }).then(res =>{
            const {code, typeData} = res
            if(code === 200){
                this.typeData = typeData
            }
        })
    },
    components:{
        Header, NoData
    }
}
</script>

<style lang="less" scoped>
.type{
    .type-content{
        position: fixed;
        left: 0;
        top: 50px;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .type-wrap{
            padding-bottom: 60px;
            .type-item{
                .type-ico{
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>