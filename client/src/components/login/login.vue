<template>
    <div class="login">
        <div class="login-content">
            <div class="fixed">
                <div class="logo">
                    <img src="./imgs/logo.png">
                </div>
                <div class="login-wrap">
                    <div class="item">
                        <div @click="hangdlechange(true)" class="login-item">
                            <span>账号登陆</span>
                        </div>
                        <div @click="hangdlechange(false)" class="login-item">
                            <span>手机登陆</span>
                        </div>
                    </div>
                    <div :class="{line: true, 'a-left': animation_login, 'a-right': !animation_login}"></div>
                </div>
                <div class="fa">
                    <Count v-if="animation_login" />
                    <Phone v-else />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Count from './child/count.vue'
import Phone from './child/phone.vue'
export default {
    data(){
        return {
            animation_login: true
        }
    },
    methods:{
        hangdlechange(flag){
            this.animation_login = flag
        }
    },
    components:{
        Count,
        Phone
    }
}
</script>

<style lang="less" scoped>
.login{
    .login-content{
        padding-bottom: 50px;
        .fixed{
            width: 100%;
            .logo{
                img{
                    width: 150px;
                    height: 150px;
                    display: block;
                    margin: 0 auto;
                }
            }
            .login-wrap{
                padding: 10px;
                position: relative;
                .item{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    > div{
                        span{
                            color: #000;
                            font-size: 18px;
                        }
                    }
                }
                .line{
                    position: absolute;
                    bottom: 0;
                    width: 30%;
                    height: 3px;
                    transition: 0.5s left;
                    background-color: #25aff3;
                }
                .a-left{
                    left: 10%;
                }
                .a-right{
                    left: 60%;
                }
            }
            .fa{
                margin-top: 20px;
            }
        }
    }
}
</style>