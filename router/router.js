const   jwt   = require('jsonwebtoken'),
        auth  = require('../controller/auth'),
        pesan  = require('../controller/pesan'),
        index = require('../controller/index')
function jwt_token(req, res, next) {
  const tokens = req.cookies.ajI2YW52QXM3;  
  if (!tokens) return res.status(401).redirect("/");
    jwt.verify(tokens, "%SESSION_ANONYMOUS%", (err, decoded) => {
      if(err){res.redirect('/login')}
      else{
        req.decoded = decoded
        req.tokenku = tokens
        next()
      }
  });
}

module.exports = app => {
//###################################################################GET
//#######################################################################
app.get("/",                                index.index)
app.get('/login',                           auth.masuk)
app.get('/search/',                         index.cari)
app.get('/logout',                          auth.logout)
app.get('/lihat/:id',                       index.lihatWarung)
app.get('/warung',                          jwt_token,index.warung)
app.get('/Adminmenu',                       jwt_token,index.menuWarung)
app.get('/Adminmenu/hapus/:id',             jwt_token,index.hapusMenu)
app.get('/Adminkatering',                   jwt_token,index.katering)
app.get('/Admintempat',                     jwt_token,index.tempat)

app.get('/hapusTempat/:_qwe',               jwt_token,index.hapusTmpt)
app.get('/tempat/:_id',                     jwt_token,index.cekTempat)
app.get('/disewaTrue/:_id',                 jwt_token,index.mejaaktif)
app.get('/disewaFalse/:_id',                jwt_token,index.mejanonak)

app.get('/pesan/:_mejane/:_wr',             jwt_token,pesan.pesanT)
app.get('/nextPesan/:_mejane/:_wr',         jwt_token,pesan.nextPesanT)
app.get('/pembayaran/:tokencash',           jwt_token,pesan.pembayaran)
app.get('/confirm/tempat/:_as',             jwt_token,pesan.konfirT)
app.get('/riwayat',                         jwt_token,pesan.history)


//##################################################################POST
//######################################################################
app.post('/login',                          auth.postlogin)
app.post('/daftar',                         auth.postregis)
app.post('/addWarung',                      jwt_token,index.addWarung)
app.post('/addMenu',                        jwt_token,index.addMenu)
app.post('/addMeja',                        jwt_token,index.addMeja)
app.post('/editMenu/',                      jwt_token,index.editMenu)
app.post('/edit1Warung/',                   jwt_token,index.edit1Warung)
app.post('/edit2Warung/',                   jwt_token,index.edit2Warung)
app.post('/StatustempatAktif',              jwt_token,index.ubahSTa)
app.post('/StatustempatNon',                jwt_token,index.ubahSTn)
app.post('/StatuskaterAktif',               jwt_token,index.ubahSKa)
app.post('/StatuskaterNon',                 jwt_token,index.ubahSKn)

app.post('/bayar/:id',                      jwt_token,pesan.bayar)
}