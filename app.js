const   express    = require('express'),
        bodyparser = require('body-parser'),
        cuki       = require('cookie-parser'),
        sesion     = require('express-session'),
        router     = require('./router/router')
const app = express()
const port = 80

app.set('view engine','ejs') 
app.use(cuki())
app.use(express.static('public'))
app.use(sesion({ name: 'ajI0qWzp2QBM1',secret : 'mr_toni',resave:false,saveUninitialized:true,cookie:{maxAge:null}}))
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
})
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

router(app)
app.listen(port, () => console.log(`Server Mlaku .... Http://Localhost || Http://192.168.137.1`))