const   hash    =   require('password-hash'),
        jwt     =   require('jsonwebtoken'),
        users   =   require('../models/sc_auth')        
        
exports.masuk=(req,res)=>{
    res.render('page_login')
}
exports.logout=(req,res)=>{
    res.clearCookie("ajI2YW52QXM3");
    res.clearCookie("ajI0qWzp2QBM1")
    const token = jwt.sign({ foo: "ajI2YW52QXM3" }, "acak", { expiresIn: "99999s" });
    res.cookie("mr_toni", token);
    res.redirect("/");
}

exports.postlogin=(req,res)=>{
    var data={
        email   : req.body.ml,
        pass    : req.body.pw
    }
    users.findOne({where:{email : data.email}}).then(dataUser=>{
        if(!dataUser){
            req.session.message = {
                type: 'danger',
                intro: 'ERROR !',
                message: 'User Tidak ada'
            }            
            res.redirect('/login')
        }
        else{                                            
            const verif = hash.verify(data.pass , dataUser.pass )
            if(verif){
                const data = { idUser: dataUser.id_user };
                const token = jwt.sign(data, "%SESSION_ANONYMOUS%", {
                  expiresIn: "99999s"
                });        
                res.cookie("ajI2YW52QXM3", token);
                res.redirect('/')
            }
            else{
                req.session.message = {
                    type: 'danger',
                    intro: 'ERROR !',
                    message: 'Password Tidak cocok'
                }            
                res.redirect('/login')
            }
        }
    })
}
exports.postregis=(req,res)=>{
    var data={
        nama    : req.body.nama,
        email   : req.body.ml,
        pass    : hash.generate(req.body.pw)
    }        
    console.log(data);
    if(data.nama.length == 0 || data.email.length == 0 || req.body.pw.length == 0){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR !',
            message: 'Tidak Boleh Kosong'
        }            
        res.redirect('/login')
    }
    else if(!/^[a-zA-Z ]*$/.test(data.nama)){
        req.session.message = {
            type: 'danger',
            intro: 'ERROR !',
            message: 'Karakter Ilegal'
        }            
        res.redirect('/login')
    }
    else if(req.body.pw.length < 6){
        req.session.message = {
            type: 'warning',
            intro: 'Info !',
            message: 'Pasword Minimal 6'
        }            
        res.redirect('/login')
    }
    else{        
        users.findOne({where:{email:data.email}}).then(dataUser=>{
            if(dataUser){
                req.session.message = {
                    type: 'warning',
                    intro: 'Info !',
                    message: 'Email Sudah Terdaftar'
                }            
                res.redirect('/login')
            }
            else{                        
                users.create(data).then(daftarUser=>{
                    req.session.message = {
                        type: 'success',
                        intro: 'Berhasil !',
                        message: 'User Berhasil Terdaftar '+data.email
                    }
                    res.redirect('/login')
                })
            }
        })
    }
}