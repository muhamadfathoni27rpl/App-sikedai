var mysql = require('mysql')
var koneksi = mysql.createConnection({    
    host:'localhost',
    user:'root',
    password:'arekmalang45',
    database:'appresto',
    multipleStatements:true
})

module.exports.db = koneksi;