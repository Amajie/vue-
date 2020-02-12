<template>
    <div :class="{header_com: true, fixed: fixed}" :style="{backgroundColor: bgC}">
        <div class="header-wrap">
           <div class="left" @click.stop="$emit('left_click')">
               <img v-if="left_icon" :src="left_icon">
           </div>
           <div class="center">
               <span :style="{color: left_color}">{{title}}</span>
           </div>
           <div class="right" @click.stop="$emit('right_click')">
                <div class="no-solt">
                    <span :style="{color: right_color}">{{right_text}}</span>
                    <img v-if="right_icon" :src="right_icon">
                </div>
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
    created(){
        
    },
    props:{
        bgC:{
            type: String,
            default: '#ffc100'
        },
        left_color:{
            type: String,
            default: '#fff'
        },
        right_color:{
            type: String,
            default: '#fff'
        },
        title:{
            type: String,
            default: ''
        },
        right_text:{
            type: String,
            default: ''
        },
        left_icon:{
            type: String,
            default: ''
        },
        right_icon:{
            type: String,
            default: ''
        },
        fixed:{
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="less" scoped>
.header_com{
    .header-wrap{
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding: 0 5px;
       font-size: 17px;
        .left{
            display: flex;
            align-items: center;
            img{
                width: 30px;
                height: 30px;
            }
        }
        .center{
            padding: 10px 0;
        }
        .right{
            .no-solt{
                display: flex;
                align-items: center;
                img{
                    width: 30px;
                    height: 30px;
                }
                span{
                    height: 100%;
                }
            }
        }
    }
}
.fixed{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 100;
}
</style>