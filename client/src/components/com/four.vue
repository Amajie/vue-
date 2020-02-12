<template>
    <div class="four">
        <Header title="404页面" />
        <div class="content">
            <div class="img">
                <img src="./imgs/404.png" >
            </div>
            <div class="btn">
                <mt-button @click="$router.go(-1)" type="primary" size="small">点击返回</mt-button>
                <span></span>
                <mt-button @click="$router.replace('/login')" type="danger" size="small">前往登陆</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from './header.vue'
export default {
    data(){
        return {}
    },
    components:{
        Header
    }
}
</script>

<style lang="less" scoped>
.four{
    .content{
        .img{
            img{
                display: block;
                margin: 20px auto;
            }
        }
        .btn{
            display: flex;
            justify-content: center;
            span{
                padding: 0 5px;
            }
        }
    }
}
</style>