<template>
    <div class="updata-pic">
        <div class="pic-wrap">
            <div :class="{ip: true, noClick: maxCount === goodPicArr.length}">
                <img src="./imgs/jia.png">
                <input :disabled="maxCount === goodPicArr.length" @input="handlePic($event)" type="file">
            </div>
            <div class="show">
                <div v-if="goodPicArr.length" class="has-pic">
                    <p v-for="(item, index) in goodPicArr" :key="index">
                        <img :src="item">
                        <img class="d" @click="delectPic(index)" src="./imgs/delect.png">
                    </p>
                </div>
                <div v-else class="no-pic">
                    <p>暂无图片, 最多上传{{maxCount}}张</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            goodPicArr: []
        }
    },
    methods:{
        handlePic(ev){
            // 获取完毕之后显示
            const reader = new FileReader()

            reader.readAsDataURL(ev.target.files[0])
            
            reader.onload = (evt) =>{

                const {goodPicArr, maxCount, $emit} = this
                    
                goodPicArr.push(evt.target.result)

                this.$emit('upload-change', ev.target.files[0])
                ev.target.value = ''
            }
        },

        // 删除显示图片
        setData(data){
            this.goodPicArr = data
        },

        // 删除图片
        delectPic(index){
            this.goodPicArr.splice(index, 1)
            // 删除哪张图片传入index即可 父组件根据该index删除相应的信息
            this.$emit('delect', index)
        }

    },
    props:{
        maxCount: {
            type: Number,
            default: 3,
            picArr: []
        }
    }
}
</script>

<style lang="less" scoped>
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
        .noClick{
            border: 1px dotted #ccc;
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
                font-size: 17px;
            }
        }
    }
}
</style>