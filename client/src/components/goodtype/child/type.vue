<template>
    <div class="ea">
        <Header :title="title"
            :left_icon="require('../left.png')"
            @left_click="$router.go(-1)"
            bgC="red" 
        />
        <div class="ea-content">
            <div class="up">
                <Upload 
                :maxCount="1" 
                :picArr="picArr"
                @delect="delectPic" 
                @upload-change="handlePic"
                ref="upload" 
            />
            </div>
            <mt-field label="分类" placeholder="请输入分类名字" v-model="typeText"></mt-field>
            <div class="btn">
                <mt-button @click.native="handleType" type="danger" size="large">提交</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../../com/header.vue'
import Upload from '../../com/upload.vue'
export default {
    data(){
        return {
            typeText: '',
            typePic: '',
            flag: true,// 默认添加
            title: '添加分类',
            typeId: '',
            picArr:[]
        }
    },
    created(){

        // 说明是编辑的
        if(this.$route.params.pathMatch){
            this.typeId = this.$route.params.pathMatch.split('/')[1]
            // 发送请求
            this.$store.dispatch('goodType', {params:{op: 4, typeId: this.typeId}})
            .then(res =>{

                const {code, typeData} = res
                // 获取数据不成功则为 添加分类
                if(typeData[0] && code === 200){
                    this.typeText = typeData[0].typeText
                    this.typePic = typeData[0].typePic
                    this.$refs.upload.setData([typeData[0].typePic])
                    this.flag = false
                    this.title = '编辑分类'
                }else{
                    // 出错
                    this.$router.replace('/wrong')
                }
            })
        }
    },
    methods:{
       handlePic(typePic){
           this.typePic = typePic
       },
       
       delectPic(index){
           this.typePic = ''
       },

       handleType(){

           const {typePic, typeText, Toast, $store, flag, typeId} = this
           // 验证
           if(!typeText){
               return Toast('请输入分类')
           }else if(!typePic){
               return Toast('请选择图标')
           }

            const formData = new FormData()

            formData.append('typeText', typeText)
            formData.append('typePic', typePic)

            $store.dispatch('addType', {data: formData, params:{op: flag ? 1: 2, typeId}})
            .then(res =>{
                if(res.data.code === 200){
                    this.typeText = ''
                    this.typePic = ''
                    // 调用子组件方法
                    this.$refs.upload.setData([])
                    Toast(flag?'添加成功':'修改成功')
                }
            })

       }
    },
    components:{
        Header,
        Upload
    }
}
</script>

<style lang="less" scoped>
.ea{
    .ea-content{
        .up{
            margin: 5px 0;
        }
        .btn{
            margin: 5px 0;
        }
    }
}
</style>