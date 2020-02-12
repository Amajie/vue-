
const express = require('express')
const router = express.Router()
const md5 = require('md5')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const sqlObj = require('../mysql/connect.js')

// 图形验证码
const svgCaptch = require('svg-captcha')

// 路径
const realmNamel = 'http://127.0.0.1:6060/'


const storage = multer.diskStorage({
    //存储的位置
    destination(req, file, cb){
        cb(null, `che/${file.fieldname}/`)
    },
    //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
    filename(req, file, cb){
        let endFile = ''
        if(file.mimetype === 'image/png'){
            endFile = '.png'
        }else if(file.mimetype === 'image/jpeg'){
            endFile = '.jpg'
        }else if(file.mimetype === 'image/bmp'){
            endFile = '.bmp'
        }
        
        const path = `${file.fieldname + Date.now() + endFile}`
        cb(null, path)
    }
})

const upload = multer({storage}) 

// 登陆
router.post('/login', (req, res) =>{
    
    const {userName, password, phone, svgCode} = req.body
    if(!req.session.svgCode) return res.json({"code": 0, "msg": '验证码已失效'})
    // 验证码不正确
    if(!phone && svgCode.toLowerCase() != req.session.svgCode.toLowerCase()) return res.json({"code": 1, "msg": '验证码不正确'})


    // 判断是否为手机登陆
    const sql = phone ? `SELECT * FROM users WHERE userName='${userName}' or phone = '${phone}';`:
                        `SELECT * FROM users WHERE userName='${userName}';`

    sqlObj.query(sql, (err, userData) =>{
        // 报错
        if(err) return res.json({"code": 500, "msg": '操作失败'})
        // 用户存在
        if(userData.length) return res.json({"code": 200, userData: userData[0], "msg": '登陆成功'})

         // 判断是否为手机登陆
        const userId = md5(getId(5))

        const avater = `${realmNamel}avaterPic/init.png`

        const insert = phone ? `INSERT INTO users(userId, phone, avater) VALUES('${userId}','${phone}'), '${avater}');`:
                            `INSERT INTO users( userName, userId, password, avater) VALUES('${userName}','${userId}','${md5(password)}', '${avater}');`

        sqlObj.query(insert, (err, data) =>{

            if(err) return res.json({"code": 500, "msg": '操作失败'})

            res.json({"code": 200, userData:{
                userName: userName ? userName: '',
                phone: phone ? phone: '',
                avater,
                userId
            }, "msg": '登陆成功'})
        })

        
    })
})

// 用户信息的修改
router.post('/change_user', upload.single('avaterPic'), (req, res) =>{
    
    let {userName, userId, password, phone, avater} = req.body

    // 图片上传失败
    if(!avater && !req.file) return res.json({"code": 0, "msg": "修改失败"})


    avater = !req.file? avater: `${realmNamel + req.file.fieldname}/${req.file.filename}`


    // sql语句
    const insert = `UPDATE users SET userName=${userName? "'"+userName+"'": 'users.userName'}, 
                    password=${password? "'"+md5(password)+"'": 'users.password'}, 
                    phone=${phone? "'"+phone+"'": 'users.phone'}, avater='${avater}' WHERE userId='${userId}';`
console.log(insert)
    // 执行操作
    sqlObj.query(insert, (err, data) =>{
        console.log(err)
        if(err) return res.json({"code": 500, "msg": '操作失败'})

        res.json({"code": 200, avater, "msg": '修改成功'})
    })
})

// 获取图形验证码
router.get('/getCode', (req, res) =>{
    
    // 验证码的生成
    const svgData = svgCaptch.create({
        size: 4,
        ignoreChars: '0o1i',
        noise: 3,
        color: true
    })

    req.session.svgCode = svgData.text

    res.type('svg')
    res.send(svgData.data)

})


// 分类
router.post('/good_type', upload.single('typePic'), (req, res) =>{
    
    let {op, limit, offset, typeId} = req.query 
    let {typeText, typePic} = req.body

    // 获取分类
    let str = offset? `LIMIT ${limit},${offset}`: ''
    let insert = `SELECT * FROM goodtypes order by typeId desc ${str};`

    // 插入分类
    if(op === '1'){

        if(!req.file) return res.json({"code": 0, "msg": "添加失败"})

        typeId = getId(5)
        typePic = `${realmNamel + req.file.fieldname}/${req.file.filename}`
        insert = `INSERT INTO goodtypes( typeId, typeText, typePic) VALUES('${typeId}','${typeText}','${typePic}');`

    }else if(op === '2'){// 编辑分类
        // 判断有没有新图片 没有则为图片路径
        typePic = req.file ? `${realmNamel + req.file.fieldname}/${req.file.filename}`: typePic
        insert = `UPDATE goodtypes SET typeText='${typeText}', typePic='${typePic}' WHERE typeId='${typeId}'`

    }else if(op === '3'){ // 删除分类
        insert = `DELETE FROM goodtypes WHERE typeId='${typeId}';`
    }else if(op === '4'){// 查询某个分类
        insert = `SELECT * FROM goodtypes WHERE typeId='${typeId}';`
    }


    sqlObj.query(insert, (err, typeData) =>{
        if(err) return res.json({"code": 500, "msg": '操作失败'})
        
        if(!op || op === '4'){
            res.json({"code": 200, typeData, "msg": '操作成功'})
        }else{
            res.json({"code": 200, "msg": '操作成功'})
        }
    })
})


// 添加商品
router.post('/add_good', upload.array('goodPic', 3), (req, res) =>{
    
    const {goodId} = req.query
    // 获取数据
    const {goodName, goodTypeId, goodPrice, goodOldPrice, goodNum, saveGoodPic} = req.body

    // 判断图片是否上传成功
    if( !saveGoodPic && !req.files.length) return res.json({"code": 0, "msg": "添加失败"})
    
    // 获取 图片格式 路径+ ,
    let goodPic = ''
    req.files.map((item, index) =>{
        if(index === req.files.length - 1){
            goodPic += `${realmNamel + item.fieldname}/${item.filename}`
        }else{
            goodPic += `${realmNamel + item.fieldname}/${item.filename},`
        }
    })


    // 默认更新
    let insert = `INSERT INTO goods( goodName, goodId, goodPrice, goodOldPrice, goodNum, goodPic, goodTypeId) 
        VALUES('${goodName}','${md5(getId(8))}','${goodPrice}','${goodOldPrice}','${goodNum}',
        '${goodPic}','${goodTypeId}');`


    // 这里判断是添加还是编辑
    if(goodId){// 编辑
        // 这里比较绕
        goodPic = goodPic ? (saveGoodPic ? goodPic+ ',' + saveGoodPic : goodPic) : saveGoodPic

        insert = `UPDATE goods SET goodName='${goodName}', goodTypeId='${goodTypeId}',goodPrice=${goodPrice}, goodOldPrice=${goodOldPrice}, goodNum=${goodNum}, goodPic='${goodPic}' WHERE goodId='${goodId}'`
    }

    // 执行语句
    sqlObj.query(insert, (err, data) =>{

        if(err) return res.json({"code": 500, "msg": '操作失败'})


        goodId? res.json({"code": 200, goodPic: goodPic.split(',')[0], "msg": '登陆成功'}): 
                res.json({"code": 200, "msg": '登陆成功'})
    })

})

// 获取所有商品和分类
router.get('/get_t_g_data', (req, res) =>{

    // const insert = `SELECT * FROM goodtypes, goods`
    // 表的结构一致才行
    // const insert = `(SELECT * FROM goodtypes) union (SELECT * FROM goods)`
    
    // const insert = `select * from goodtypes right join goods on goods.goodId=goodtypes.typeId`

    const insert = `select * from goodtypes  left join goods on goodtypes.typeId = goods.goodId
        union select * from goodtypes  right join goods on goodtypes.typeId = goods.goodId;`


    sqlObj.query(insert, (err, data) =>{

        if(err) return res.json({"code": 500, "msg": '获取失败'})

        // 获取数据
        const goodData = []
        const typeData = []
        data.forEach(item => {
            const {
                typeId, typeText, typePic, goodName,
                goodId, goodPrice, goodOldPrice,
                goodSell, goodNum, goodPic, goodTypeId
            } = item

            typeId ? typeData.unshift({typeText, typeId}): goodData.unshift({
                goodName, goodId, goodPrice,
                goodOldPrice, goodSell, goodNum,
                goodPic: goodPic.split(',')[0], goodTypeId
            })
        })

        res.json({"code": 200, goodData, typeData, "msg": '登陆成功'})
        // res.json({"code": 200, data, "msg": '登陆成功'})
    })
})

// 获取某个商品信息
router.get('/get_good', (req, res) =>{

    const {goodId, goodTypeId} = req.query

    const insert = goodTypeId ? `select * from goodtypes, goods WHERE goodtypes.typeId='${goodTypeId}' AND goods.goodId='${goodId}';`:// 商品编辑
                            `select * from goods WHERE goodId='${goodId}';`// 获取数据详情页                                     

    sqlObj.query(insert, (err, data) =>{

        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '获取失败'})

        if(!data.length) return res.json({"code": 1, "msg": '数据为空'})

        // 将图片转为数组形式
        data[0].goodPic = data[0].goodPic.split(',')

        res.json({"code": 200,goodObj: data[0], "msg": '登陆成功'})
    })
})

// 获取首页数据 获取十二条数据即可
router.get('/get_home', (req, res) =>{

    const insert = `select * from goods;`


    sqlObj.query(insert, (err, homeData) =>{

        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '获取失败'})

        if(!homeData.length) return res.json({"code": 1, "msg": '数据为空'})

        // 将图片转为数组形式
        homeData.forEach((item, index) =>{
            item.goodPic = item.goodPic.split(',')
        })


        res.json({"code": 200, homeData, "msg": '登陆成功'})
    })

})

// 加入购物车
router.post('/add_car', (req, res) =>{

    const {carUserId, carGoodId} = req.body

    let insert = `SELECT carGoodId, carUserId FROM cars WHERE carGoodId='${carGoodId}' AND carUserId='${carUserId}';`
    
    sqlObj.query(insert, (err, data) =>{
        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '操作失败'})

        if(data.length) return res.json({"code": 1, "msg": '已经在购物车里面了'})

        // 没有加入购物车
        insert = `INSERT INTO cars(carId, carUserId, carGoodId) VALUES('${md5(getId(7))}', '${carUserId}','${carGoodId}');`

        sqlObj.query(insert, (insertErr, insertData) =>{
            // 插入失败
            if(insertErr) return res.json({"code": 500, "msg": '操作失败'})
    
            res.json({"code": 200, "msg": '加入购物车成功成功'})
        })
    })

})
// 更新购物车
router.post('/set_car', (req, res) =>{

    const {carId, count} = req.body

    const insert = `UPDATE cars SET carNum='${count}' WHERE carId='${carId}';`    

    sqlObj.query(insert, (err, data) =>{

        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '操作失败'})
        res.json({"code": 200, "msg": '操作成功'})
    })

})

// 获取购物车
router.get('/get_car', (req, res) =>{

    const {carUserId, limit=0, offset=9} = req.query

    // 此时可以做分页
    const insert = `SELECT * FROM cars, goods WHERE cars.carGoodId = goods.goodId AND cars.carUserId='${carUserId}' LIMIT ${limit*offset},${offset};`

    sqlObj.query(insert, (err, carData) =>{

        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '获取失败'})
        if(!carData.length) return res.json({"code": 1, carData, "msg": '没有数据了'})
        // 成功
        res.json({"code": 200, carData, "msg": '加入购物车成功'})
    })

})

// 删除购物车数据
router.post('/delect_car', (req, res) =>{

    const {carIdList} = req.body
    const {carUserId} = req.query

    // 获取正则
    let str = ''
    let insert = `DELETE FROM cars WHERE carUserId='${carUserId}' AND carId='${carIdList[0]}';`

    // 删除多个才需要正则
    if(carIdList.length > 1){
        carIdList.forEach(item =>{
            str += item + '|'
        })
        // 除去最会一个 |
        str = str.substr(0, str.length - 1)

        insert = `DELETE FROM cars WHERE carUserId='${carUserId}' AND carId REGEXP '${str}';`
    }

    sqlObj.query(insert, (err, carData) =>{

        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '获取失败'})

        res.json({"code": 200, "msg": '删除成功'})
    })

})


// 地址增改
router.post('/address', (req, res) =>{

    const {aId, aName, address, aPhone, aInit, aUserId} = req.body

    // 默认添加
    let insert = `INSERT INTO address(aId, aName, address, aPhone, aUserId) 
                                VALUES('${getId(2)}','${aName}', '${address}', '${aPhone}', '${aUserId}')`
    
    // 修改
    if(aId && !aName){
        insert = `UPDATE address SET aInit= CASE aId WHEN '${aId}' THEN '${aInit? 1: 0}' END`
    }else if(aId){
        insert = `UPDATE address SET aName='${aName}', address='${address}', aPhone='${aPhone}' WHERE aId='${aId}';`
    }


    sqlObj.query(insert, (err, addressData) =>{

        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '操作失败'})

        res.json({"code": 200, "msg": '操作成功'})
    })

})

// 地址删查
router.get('/get_address', (req, res) =>{

    const {aId, aUserId, aInit} = req.query
    
    const insert = aId? `SELECT * FROM address WHERE aId='${aId}'`: // 编辑查询
                        aInit?  `SELECT * FROM address WHERE aUserId='${aUserId}' AND aInit=1`:
                        `SELECT * FROM address WHERE aUserId='${aUserId}'` // 查询所有
    sqlObj.query(insert, (err, addressData) =>{

        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '操作失败'})

        res.json({"code": 200, addressData, "msg": '操作成功'})
    })

})

// 订单增删改查
router.post('/order', (req, res) =>{
    const {orderUserId,orderName, orderPhone, orderAddress, orderData} = req.body

 
    let values = ''
    // 时间
    const orderTime =  getTime()
    // 遍历获取sql语句
    orderData.forEach((item, i) =>{
        const orderId = getId(i+ 4) 
        const str = i < orderData.length-1 ? ', ': ''
        values += `('${orderId}', '${orderUserId}', '${orderName}','${orderPhone}', '${orderTime}', 
                '${orderAddress}', '${item.goodPic}', '${item.goodPrice}', '${item.carNum}', 
                '${item.goodName}', '${item.goodId}', '${item.oGoodLetter}')${str}`
    })

    const insert = `INSERT INTO orders(orderId, orderUserId, orderName, orderPhone, orderTime, orderAddress,
                            oGoodPic, oGoodPrice, oGoodNum, oGoodName, oGoodId, oGoodLetter) VALUES${values}`
    
                            console.log(insert)
    sqlObj.query(insert, (err, orderData) =>{

        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '操作失败'})

        res.json({"code": 200, "msg": '操作成功'})
    })
})


// 修改订单数据
router.post('/change_order', (req, res) =>{

    const {orderId, sendGoodFlag, orderUserId, carNum, goodId,
        commitFlag, finishFlag, postSellFlag} = req.body

    let str = ''

    if(sendGoodFlag){
        str = 'sendGoodFlag=1'
    }else if(commitFlag){
        str = 'commitFlag=1'
    }else if(finishFlag){
        str = 'finishFlag=1'
    }else if(postSellFlag){
        str = 'postSellFlag=1'
    }

    let insert = `UPDATE orders SET ${str} WHERE ${sendGoodFlag? '': 'orderUserId='+ "'"+orderUserId+"' AND"} orderId='${orderId}'`

    sqlObj.query(insert, (err, orderData) =>{
        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '操作失败'})

        if(!finishFlag) return res.json({"code": 200, "msg": '操作成功'})

        // 更新销量
        insert = `UPDATE goods set goodSell = goods.goodSell + ${carNum} WHERE goodId='${goodId}'`

        sqlObj.query(insert, (err, data) =>{

            if(err) return res.json({"code": 500, "msg": '操作失败'})

            res.json({"code": 200, "msg": '收取成功'})
        })

    })
})

// 订单查询
router.get('/get_order', (req, res) =>{


    const {orderUserId, orderOp, limit=0, offset=3, userGrade=0} = req.query

    // 默认是没有发货的
    let str = 'sendGoodFlag=0 AND postSellFlag=0'

    // 待收货
    if(orderOp === '2'){ // 待收货
        str = 'sendGoodFlag=1 AND finishFlag=0'
    }else if(orderOp === '3'){// 待评价
        str = 'sendGoodFlag=1 AND finishFlag=1 AND commitFlag=0'
    }else if(orderOp === '4'){ // 售后
        str='postSellFlag=1'
    }else if(orderOp === '5'){ // 已经完成并评价的订单
        str='sendGoodFlag=1 AND finishFlag=1 AND commitFlag=1'
    }


    const insert = `SELECT * FROM orders WHERE ${userGrade != '1'? 'orderUserId='+ "'"+orderUserId +"'" +' AND': ''} ${str} LIMIT ${limit*offset}, ${offset};`

    sqlObj.query(insert, (err, orderData) =>{
        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '操作失败'})
        if(JSON.stringify(orderData) === '[]') return res.json({"code": 1, orderData, "msg": '没有数据了'})
        // 成功
        res.json({"code": 200, orderData, "msg": '操作成功'})
    })
})


// 评论插入
router.post('/insert_commit', upload.array('commitPic', 3), (req, res) =>{


        // 获取 图片格式 路径+ ,
        let commitPic = ''
        req.files.map((item, index) =>{
            if(index === req.files.length - 1){
                commitPic += `${realmNamel + item.fieldname}/${item.filename}`
            }else{
                commitPic += `${realmNamel + item.fieldname}/${item.filename},`
            }
        })

    const {commitGrade, commit, commitOrderId, commitUserId, commitGoodId} = req.body

    const commitTime =  getTime()


    const insert = `INSERT INTO commits(commitId, commitGrade, commitPic, commit, 
        commitOrderId, commitUserId, commitGoodId, commitTime) VALUES(
            '${md5(getId(5))}', ${commitGrade}, '${commitPic}', '${commit}', '${commitOrderId}', '${commitUserId}', '${commitGoodId}', '${commitTime}');`
    
    const commitFlagStr = `UPDATE orders SET commitFlag=1 WHERE orderId='${commitOrderId}'`
    
    
    
    sqlObj.query(commitFlagStr, (err, data) =>{
        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '操作失败'})
        // 即使 评论插入失败 也返回成功 由于mysql能力有限
        sqlObj.query(insert, (err, data) =>{
            res.json({"code": 200, "msg": '操作成功'})
        })
    })

})
// 评论获取
router.get('/get_commit', (req, res) =>{

    const {commitGoodId} = req.query

    const insert = `select * from users  left join commits on users.userId = commits.commitUserId  WHERE commitGoodId='${commitGoodId}';`
    
    sqlObj.query(insert, (err, commitData) =>{
        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '操作失败'})

        res.json({"code": 200, commitData, "msg": '操作成功'})
    })

})


// 搜索数据
router.get('/search', (req, res) =>{

    const {keyWord, limit=0, offset=6} = req.query

    let str = ''
    for(let i=0; i< keyWord.length; i++){
        str += keyWord[i] + '|'
    }   

    str = str.substr(0, str.length - 1)

    const insert = `SELECT * FROM goods WHERE goodName REGEXP '${str}' LIMIT ${limit*offset}, ${offset};`
    
    sqlObj.query(insert, (err, searchData) =>{

        // 操作失败 或者没有数据
        if(err) return res.json({"code": 500, "msg": '搜索失败'})
        if(JSON.stringify(searchData) === '[]') return res.json({"code": 1, searchData, "msg": '数据为空'})

        searchData.forEach((item, index) =>{
            item.goodPic = item.goodPic.split(',')
        })

        res.json({"code": 200, searchData, "msg": '搜索成功'})
    })

})




// 获取城市信息
router.get('/getCity', (req, res) =>{
    fs.readFile(path.join(__dirname, '../city/cityData.json'), 'utf-8', function(err, cityData) {
        if (err) {
            res.json({"code": 0, cityData: []})
        } else {
            cityData = JSON.parse(cityData)
            res.json({"code": 200, cityData})
        }
    })
})

// 获取时间
function getTime(){
    const dataTime = new Date()
    return`${dataTime.getFullYear()}-${('0'+(1+dataTime.getMonth())).slice(-2)}-${('0'+dataTime.getDate()).slice(-2)}`
}





// 生成id
function getId(length){
    return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
}


module.exports = router