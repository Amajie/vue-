<template>
    <div class="commit">
        <div 
            v-for="(item, index) in commitData"
            :key="index"
            class="commit-wrap">
            <div class="user-info">
                <div class="l">
                    <img :src="item.avater">
                </div>
                <div class="r">
                    <p class="t">
                        {{item.userName? item.userName: '匿名用户'}}
                    </p>
                    <div class="b">
                        <p>
                            <img 
                                v-for="(s, sIndex) in item.commitGrade"
                                :key="sIndex"
                                src="./imgs/s.png">

                            <img 
                                v-for="(b, bIndex) in (5 - item.commitGrade)"
                                :key="bIndex+'ddd'"
                                src="./imgs/b.png">
                        </p>
                        <span class="time">
                            {{item.commitTime}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="commit-info">
                <p>
                    {{item.commit}}
                </p>
            </div>
            <div class="commit-pic">
                <img 
                    v-for="(goodPic, goodIndex) in item.commitPic"
                    :key="goodIndex"
                    :src="goodPic">
            </div>
        </div>
        <p class="no-more">没有更多评论了</p>
    </div>
</template>

<script>
export default {
    data(){
        return{}
    },
    methods:{
    },
    props:{
        commitData: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style lang="less" scoped>
.commit{
    .commit-wrap{
        display: flex;
        flex-direction: column;
        padding: 5px 0;
        border-bottom: 1px solid #e0e0e0;
        .user-info{
            display: flex;
            align-items: center;
            .l{
                img{
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
            }
            .r{
                display: flex;
                flex: 1;
                flex-direction: column;
                .t{
                    margin-bottom: 5px;
                }
                .b{
                    display: flex;
                    flex: 1;
                    justify-content: space-around;
                    align-items: center;
                    p{
                        display: flex;
                        align-items: center;
                        img{
                            width: 20px;
                            height: 20px;
                        }
                       
                    }
                    .time{
                        margin-left: 15px;
                    }
                }
            }
        }
        .commit-info{
            p{
                padding: 5px 15px;
                line-height: 22px;
                word-break: break-all;
                color: #333;
            }
        }
        .commit-pic{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 15px;
            img{
                width: 50px;
                max-height: 50px;
                margin: 0 5px;
            }
        }
    }
    .no-more{
        padding-bottom: 20px;
    }
}
</style>