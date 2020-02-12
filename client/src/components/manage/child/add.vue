<template>
    <div class="add">
        <div class="add-content">
            <div v-if="editGoodFlag" class="title">
                <span>正处于编辑商品中</span>
            </div>
            <div class="info">
                <mt-field label="商品名字" placeholder="请输入商品名字" v-model="goodName" />
                <mt-field label="商品分类" @click.native="showPopup" readonly placeholder="请选择商品分类" v-model="typeText" />
                <mt-field label="目前价格" type="number" placeholder="目前商品价格" v-model="goodPrice" />
                <mt-field label="原始价格" type="number" placeholder="原始商品价格" v-model="goodOldPrice" />
                <mt-field label="库存" type="number" placeholder="目前库存数量" v-model="goodNum" />
            </div>
            <Upload 
                @upload-change="handlePic"
                @delect="delectPic"
                ref="upload"
            />
            <div class="add-btn">
                <mt-button v-if="editGoodFlag" @click.native="$emit('add-reject')" size="large" type="danger">取消</mt-button>
                <mt-button @click.native="handleAdd" size="large" type="primary">提交</mt-button>
            </div>
        </div>
       <mt-popup
            v-model="show_popup"
            position="bottom"
            popup-transition="popup-fade"
            >
            <mt-picker :slots="typeTextData" @change="selectType" />
            <span class="o" @click.stop="show_popup = false">关闭</span>
        </mt-popup>
    </div>
</template>
<script>
import { Toast} from 'mint-ui'
import Upload from '../../com/upload.vue'
export default {
    data(){
        return {
            goodId: '',
            goodName: '',
            goodTypeId: '',
            typeText: '',
            goodPrice: '',
            goodOldPrice: '',
            goodNum: '',
            goodPic: [], // file对象
            show_popup: false,
            typeTextData:[{values: []}],
            flag: true
        }
    },
    methods:{

        // 添加
        handleAdd(){
            const {goodName , typeText, goodPrice, goodId, typeData,
                goodOldPrice, goodPic, goodNum, flag, Toast} = this

            if(!(goodName && goodName && goodPrice && goodNum && goodPic.length))
                return Toast('有数据为空, 原始价格可不填')

            // 创建数据
            const formData = new FormData()
            let saveGoodPic = ''

            // 获取图片数据
            goodPic.forEach(item => {

                if(typeof item === 'string'){
                    saveGoodPic += `${item},`
                }else{
                    formData.append('goodPic', item)
                }
            })


            // 获取goodTypeId
            const i = typeData.findIndex(item => item.typeText === typeText)

            const goodTypeId = typeData[i].typeId

            formData.append('goodName', goodName)
            // 这里需要获取分类的id
            formData.append('goodTypeId', goodTypeId)
            formData.append('goodPrice', goodPrice)
            formData.append('goodOldPrice', goodOldPrice)
            formData.append('goodNum', goodNum)
            formData.append('saveGoodPic', saveGoodPic? saveGoodPic.substr(0, saveGoodPic.length - 1): '')

            this.$store.dispatch('addGood', {
                data: formData, params: {goodId}
            }).then(res =>{
                if(res.code != 200) return

                if(flag) {
                    this.cleartData()
                    
                    return Toast('添加成功')
                }

                Toast('编辑成功')
                this.$emit('add-resolve', {
                    goodName, goodOldPrice, goodPrice, goodPic: res.goodPic
                })
            })
        },

        getTypeText(){
                if(!this.typeData.length) return
                this.typeTextData[0].values = this.typeData.map(item => item.typeText)
        },

        showPopup(){
            this.show_popup = true
            this.typeText = this.typeTextData[0].values[0]
        },

        // 获取编辑数据
        getEditData(goodId, goodTypeId, typeData){
            // 发送请求拿数据
            this.$store.dispatch('getGood', {
                goodId,
                goodTypeId
            }).then(res =>{
                if(res.code === 200){
                    for(const key in res.goodObj) {
                        if(this.hasOwnProperty(key)){
                            this[key] = res.goodObj[key]
                        } 
                    }
                    // 注意这里应用类型 要克隆
                    this.$refs.upload.setData(this.goodPic.slice())
                    this.typeData = typeData
                    this.flag = false
                }else{
                    // 获取出错
                    this.$router.replace('/wrong')
                }
            })
 
        },

        // 清空数据
        cleartData(){
            this.goodId = ''
            this.goodName = ''
            this.goodTypeId = ''
            this.typeText = ''
            this.goodPrice = ''
            this.goodOldPrice = ''
            this.goodNum = ''
            this.goodPic = []
            this.$refs.upload.setData([])
        },

        // 获取file图片 对象
        handlePic(file){
           this.goodPic.push(file)
        },
        // 选择分类
        selectType(picker, values){
            if(this.show_popup){
                this.typeText = values[0]
            }
        },
        // 删除图片
        delectPic(index){
            this.goodPic.splice(index, 1)
        }
    },
    created(){
        if(this.$route.name === 'Add'){
            this.$store.dispatch('goodType', {}).then(res =>{
                const {code, typeData} = res
                if(code === 200){
                    this.typeData = typeData
                    this.getTypeText()
                }
            })
        }
    },
    components:{
        Upload
    },
    props:{
        editGoodFlag:{
            type: Boolean,
            default: false
        },
        'add-reject': Function,
        'add-resolve': Function
    }
}

</script>

<style lang="less" scoped>
.add{
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow-y: auto;
    .add-content{
        padding-bottom: 20px;
        .title{
            text-align: center;
            padding: 5px 0;
            background-color: #e0e0e0;
        }
        .updata-pic{
            padding: 0 3px;
            .pic-wrap{
                display: flex;
                padding: 10px;
                align-items: center;
                border: 1px dotted #007acc;
                img{
                    width: 60px;
                    height: 60px;
                }
                .ip{
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 80px;
                    height: 80px;
                    margin-right: 10px;
                    border: 1px dotted #007acc;
                    input{
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                    }
                }
                .show{
                    flex: 1;
                    .has-pic{
                        display: flex;
                        p{
                            margin-left: 5px;
                            position: relative;
                            .d{
                                position: absolute;
                                right: 0;
                                top: 0;
                                margin: 2px;
                                width: 15px;
                                height: 15px;
                            }
                        }
                    }
                    .no-pic{
                        text-align: center;
                    }
                }
            }
        }
        .add-btn{
            margin: 10px 0;
            display: flex;
        }
    }
    .o{
        position: absolute;
        right: 0;
        top: 0;
        padding: 10px 15px;
        &:active{
            background-color: #e0e0e0;
        }
    }
}
</style>