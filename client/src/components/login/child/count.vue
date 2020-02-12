<template>
    <div class="count">
        <div class="count-content">
            <mt-field  placeholder="请输入用户名" v-model="userName" />
            <mt-field disableClear :type="pasFlag ? 'password' : 'text'"  placeholder="请输入密码" v-model="password" >
                <div @click="pasFlag = !pasFlag">
                    <img v-if="pasFlag" src="../imgs/eye.png" height="25px" width="25px">
                    <img v-else src="../imgs/seye.png" height="25px" width="25px">
                </div>
            </mt-field>
            <mt-field  placeholder="请输入验证码" v-model="svgCode" >
                <!-- 此时返回的应该是svg显示 -->
                <img @click="getCaptch" ref="svgCaptch" :src="url" height="50px" width="120px">
            </mt-field>
            <div class="btn">
                <p>如果账号未被使用，登陆成功后会注册该账号，注册成功后视为已阅读并同意协议<span>&lt;车神超市协议&gt;</span></p>
                <mt-button @click.native="handleLogin" size="large" type="primary">登陆</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    data(){
        return {
            userName: '1233',
            password: '12321312321312',
            svgCode: '3123213',
            pasFlag: false,// 密码是否可见标志位
            // url: 'http://123.56.22.16:6060/getCode'
            url: 'http://127.0.0.1:6060/getCode'
        }
    },
    methods:{
        ...mapActions(['enterLogin']),

        // 处理登陆
        handleLogin(){
            const {userName, password, svgCode, enterLogin, Toast} = this

            // 判断信息输入是否正确
            if(!userName){
                return Toast('请输入用户名')
            }else if(userName.length < 4 || userName.length > 8){
                return Toast('用户名长度在4~8之间')
            }else if(password.length < 8 || password.length > 16){
                return Toast('密码长度在8~16之间')
            }else if(!password){
                return Toast('请输入密码')
            }else if(!svgCode){
                return Toast('请输入验证码')
            }

            // 发送请求
            enterLogin({
                userName,
                password,
                svgCode
            })
        },

        // 刷新你验证码
        getCaptch(){
            this.$refs.svgCaptch.src = `${this.url}?time=${Date.now()}`
        }
    }
}
</script>

<style lang="less" scoped>
.count{
    .count-content{
      .btn{
          p{
              padding: 10px;
              font-size: 17px;
              span{
                  color: red;
              }
          }
      }
    }
}
</style>