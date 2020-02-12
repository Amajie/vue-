<template>
    <div class="phone">
        <div class="phone-content">
            <mt-field type="number"  placeholder="请输入手机号" v-model="phone" />
            <mt-field  placeholder="请输入验证码" v-model="code" >
                <span v-if="!currentCode" @click="getCode">获取验证码</span>
                <span v-else disabled>倒计时({{time}})s</span>
            </mt-field>
            <div class="btn">
                <p>登陆成功后会注册该手机号，注册成功后视为已阅读并同意协议<span>&lt;车神超市协议&gt;，</span>这里只是模拟短信发送，并没有实现。</p>
                <mt-button @click.native="handleLogin" size="large" type="primary">登陆</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            phone: '',
            code: '',
            currentCode: '',
            time: 59
        }
    },
    methods:{
          // 处理登陆
        handleLogin(){
            const {$store, phone, code, currentCode, Toast, MessageBox} = this

            // 判断信息输入是否正确
            if(!phone){
                return Toast('请输入手机号')
            }else if(!/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone)){
                return Toast('手机输入错误')
            }else if(!code){
                return Toast('请输入验证码')
            }else if(code != currentCode){
                return Toast('验证码错误')
            }

            // 此时不应该这里清除的 因为这里没有真实模拟手机发短信
            // 所以就在这里清除的时期里
            clearInterval(this.clearTime)

            // 发送请求
            $store.dispatch('enterLogin', {phone})
        },

        // 模拟发短信
        getCode(){

            const code = Math.random().toString().substr(3,4)
            
            this.MessageBox('提示', '您的验证码为：'+code).then(() =>{

                this.currentCode = code
                this.clearTime = setInterval(() =>{
                    let {time} = this
                    this.time = --time

                    if(this.time <= 0){
                        clearInterval(this.clearTime)
                    }
                }, 1000)
            })
        }
    }
}
</script>

<style lang="less" scoped>
.phone{
    .phone-content{
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