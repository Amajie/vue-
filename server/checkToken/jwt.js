/**
 * @function 设置生成token 和验证token的文件
 * 
 */

const jwt = require('jsonwebtoken')

const secretKey = 'che-hj-www://jie412.com'//加密参数 解密也需要它
const expiresIn = 60*60*4 // 设置token过期时间

// 保存登陆时间
let loginMap = new Map()

/**
 * @function 生成token 这里是登陆成功后调用
 * @param {*} data 需要保存在token的数据
 */
 exports.createToken = data => {
    const currentTime = Date.now()

    // 每次保存的是最新的 登陆时间
    loginMap.set(data.userId.toString(), currentTime)
    // 保存当前登陆的时间
    data.mapTime = currentTime
    console.log(jwt.sign(data, secretKey, {expiresIn}))
    return jwt.sign(data, secretKey, {expiresIn})
 }

 /**
 * @function 生成token 这里是登陆成功后调用
 * @param {*} data 需要保存在token的数据
 */
exports.checkToken = (req, res, next) =>{

    // 获取token
    let token = req.headers['jie412.com-token']

    // 否则解析token
    jwt.verify(token, secretKey, (err, decoded) =>{

        //解析错误 说明为无效token 此时应该要去登陆页面
        if(err) return res.json({"success": false, "msg": 'token信息错误.', "code": 401})

        // 获取最新的时间
        const mapTime = loginMap.get(decoded.userId.toString())
        
        // 此时 mapTime不存在无需判断 这里多此一举了 此时说明存在一个账户两处登陆
        // mapTime - decoded.mapTime >= 0

        const t = mapTime - decoded.mapTime

        if(t && !(t > expiresIn*1000))
            return res.json({"success": false, "msg": '已在别处登录，强制下线', data: null, "code": 110})

        //否则 decoded即为解析完毕的token 可以把数据保存在 req中
        if(decoded.userName){
            req.userName = decoded.userName
            req.email = decoded.email
            req.userId = decoded.userId
        }else{
            req.adminEmail = decoded.adminEmail
            req.adminGrade = decoded.adminGrade
        }
        next()
    })
}

exports.delectLoginMap = (req, res) =>{

    const {userId} = req.body

    const newArr = Array.from(loginMap).filter(item =>{
        // 二维键值对数组 item 返回不是 退出用户的键值对
        return item[0] != userId
    })

    // 有数据重新赋值
    if(newArr.length) loginMap = new Map(newArr)

    res.json({"msg": "退出成功", "code": 200})
}
 