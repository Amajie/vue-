<template>
    <div class="no-wrap">
        <div>
            <img src="./imgs/no.png">
            <span>{{info}}</span>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{}
    },
    props:{
        info: {
            type: String,
            default: '没有数据'
        }
    }
}
</script>

<style lang="less" scoped>
.no-wrap{
    div{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
            width: 50%;
        }
        span{
            font-size: 20px;
            padding-bottom: 10px;
        }
    }
}
</style>