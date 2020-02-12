
// 定义vuex的state数据
export default sessionStorage.getItem('state')? JSON.parse(sessionStorage.getItem('state')):
{
    show_tabbar: true, // 是否显示tabbar
    searchTop: 0,
    userData:{
        userName: '',
        phone: '',
        avater: '',
        userGrade: 0,
        userId: ''
    },// 用户数据
    loading: false // 是否显示loading
}
