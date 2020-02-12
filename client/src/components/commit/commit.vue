<template>
    <div class="commit">
        <div class="commit-wrap">
            <Header title="评论" />
            <div class="commit-in">
                <div class="content-in">
                    <div class="t">
                        <img 
                            v-for="(item, index) in gradeArr"
                            :key="index"
                            @click="handleGrade(index)"
                            :src="item ?require('./imgs/s.png') : require('./imgs/b.png')" />
                        
                    </div>
                    <div class="c">
                        <mt-field placeholder="请输入评论---->限制66个字" type="textarea" rows="4" v-model="commit"></mt-field>
                    </div>
                    <div class="u">
                        <Upload @upload-change="getCommitPic" @delect="delectPic" />
                    </div>
                    <div class="commit-btn">
                        <mt-button @click.native="$router.go(-1)" size="large" type="danger">取消</mt-button>
                        <span></span>
                        <mt-button size="large" @click.native="handleSend" type="primary">发表</mt-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../com/header.vue'
import Upload from '../com/upload.vue'
export default {
    data(){
        return {
            commit: '',
            commitGrade: '',
            commitPic: [],
            gradeArr:[false, false, false, false, false]
        }
    },

    methods:{

        handleSend(){

            if(!sessionStorage.getItem('orderInfo')) return console.log('失败')

            const {commitGrade, commitPic, commit, $store, $router, MessageBox} = this
            
            const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))
            
            const commitUserId = $store.state.userData.userId
            const commitGoodId = orderInfo.goodId
            const commitOrderId = orderInfo.orderId

            const formData = new FormData()

            // 获取图片
            commitPic.forEach(item => {
                formData.append('commitPic', item)
            })

            formData.append('commitGrade', commitGrade)
            formData.append('commit', commit)
            formData.append('commitUserId', commitUserId)
            formData.append('commitGoodId', commitGoodId)
            formData.append('commitOrderId', commitOrderId)


            $store.dispatch('insertCommit', formData).then(res =>{
                if(res.code === 200) 
                    return MessageBox.alert('发表成功').then(() => $router.go(-1))
            })


        },

        // 获取评分
        handleGrade(index){
            this.commitGrade = index + 1
            // 返回新数组
            this.gradeArr = this.gradeArr.map((item, i) => i <= index)
        },
        // 获取图片
        getCommitPic(file){
            this.commitPic.push(file)
        },
        // 删除图片
        delectPic(index){
            this.commitPic.splice(index, 1)
        }
    },
    components:{
        Header,
        Upload
    }
}
</script>

<style lang="less" scoped>
.commit{
    .commit-wrap{
        .commit-in{
            .content-in{
                .t{
                    display: flex;
                    border: 1px dotted #007aff;
                    margin: 5px 3px;
                    justify-content: center;
                    align-items: center;
                    padding: 10px;
                    img{
                        width: 40px;
                        height: 40px;
                        margin: 0 3px;
                    }
                }
                .c{
                    border: 1px dotted #007aff;
                    margin: 5px 3px;
                }
                .commit-btn{
                    display: flex;
                    padding: 5px 10px;
                    justify-content: space-around;
                    span{
                        padding: 0 5px;
                    }
                }
            }
        }
    }
}
</style>