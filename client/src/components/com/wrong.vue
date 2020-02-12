<template>
    <div class="wrong">
        <Header title="出错了"
            bgC="#d9d9d9"/>
        <div class="content">
            <div class="img">
                <img src="./imgs/wrong.png" >
            </div>
            <div class="btn">
                <mt-button @click="$router.replace('/home')" size="small">前往首页</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from './header.vue'
export default {
    components:{
        Header
    }
}
</script>

<style lang="less" scoped>
.wrong{
    .content{
        .img{
            img{
                display: block;
                height: 120px;
                margin: 20px auto;
            }
        }
        .btn{
            display: flex;
            justify-content: center;
        }
    }
}
</style>