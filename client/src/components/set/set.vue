<template>
    <div class="set">
        <div class="set-content">
            <Header title="设置" 
                @left_click="$router.go(-1)" 
                :left_icon="require('../com/imgs/left.png')"
                bgC="#00d3be"
           />
          <div class="content">
                <div class="change-pic">
                    <input class="i" type="file" @input="getAvater($event)">
                    <mt-field label="头像" readonly>
                        <img v-if="avaterPic" :src="avaterPic" height="50px" width="50px">
                        <img v-else :src="userData.avater" height="50px" width="50px">
                    </mt-field>
                </div>
                <mt-field label="用户名" :placeholder="userName? userData.userName: '为自己取一个用户名吧'" v-model="userName" />
                <mt-field label="密码" placeholder="********" v-model="password" />
                <mt-field label="手机号" :placeholder="phone? userData.phone: '暂未绑定手机号'" v-model="phone" />
                <div class="btn">
                    <mt-button @click.native="handleChange" size="large" type="primary">保存</mt-button>
                </div>
          </div>
        </div>
    </div>
</template>

<script>
import Header from '../com/header.vue'
import {mapState} from 'vuex'
export default {
    data(){
        return {
            userName:'',
            avater: '',
            phone: '',
            password: '',
            userId: '',
            avaterPic: ''
        }
    },

    computed:{
        ...mapState([
            'userData'
        ])
    },
    created(){
        for(let key in this.userData){
            if(key != 'password')
                this[key] = this.userData[key]
        }
    },
    methods:{
        // 获取选择的图片
        getAvater(ev){
            const fileReader = new FileReader()

            fileReader.readAsDataURL(ev.target.files[0])

            fileReader.onload =(res) =>{
                this.avaterPic = res.target.result
                this.avater = ev.target.files[0]
                ev.target.value = ''
            }
        },
        // 发送数据
        handleChange(){

            // 发送请求
            const {userName, phone, password, avater, 
                $store, userData, Toast} = this
            const formData = new FormData()

            if(userName === userData.userName && phone === userData.phone 
            && avater === userData.avater && !password){
                return Toast('无数据变化')
            }
                

            formData.append('userName', userName)
            formData.append('userId', userData.userId)
            formData.append('phone', phone)
            formData.append('password', password)

            avater != userData.avater? 
                formData.append('avaterPic', avater): 
                formData.append('avater', avater)

            // 不能上传两个file对象的数据 这里会报错
            // formData.append('avater', avater)


            $store.dispatch('changeUser', formData)
            .then(res =>{
                if(res.code === 200){
                    this.password = ''
                    $store.commit('setState',{
                        userData:{
                            ...userData,
                            userName,
                            phone, 
                            avater: res.avater
                        }
                    })
                }
            })




        }
    },
    components:{
        Header
    }
}
</script>

<style lang="less" scoped>
.set{
    .set-content{
        .content{
            .change-pic{
                position: relative;
                .i{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    opacity: 0;
                }
                img{
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>