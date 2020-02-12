<template>
    <div class="edit-good">
        <div class="edit-good-content">
            <Header 
                title="添加商品"
                @left_click="$router.go(-1)"
                :left_icon="require('../imgs/left.png')"
            />
            <Add />
        </div>
    </div>
</template>
<script>
import Header from '../../com/header.vue'
import Add from './add.vue'
export default {
    data(){
        return {
            goodData: [],
            typeTextData: []
        }
    },
    methods:{
        handleGood(){}
    },
    components:{
        Header,
        Add
    }
}
</script>

<style lang="less" scoped>
.edit-good{
    .edit-good-content{
        .add{
            top: 50px;
        }
    }
}
</style>