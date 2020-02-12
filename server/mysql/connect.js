
// 引入包
const mysql = require('mysql')


const sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'cheshop'
})


sql.connect()

module.exports =  sql

