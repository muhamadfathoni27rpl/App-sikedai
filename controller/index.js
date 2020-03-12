const   jwt     =   require('jsonwebtoken'),
        url     =   require('url'),
        waktu   =   require('date-and-time'),        
        qrm     =   require('qr-image'),
        fs      =   require('fs'),
        forD    =   new Date(),
        hari    =   waktu.format(forD,'dddd')
        jam     =   waktu.format(forD, 'HH:mm'),
        users   =   require('../models/sc_auth'),
        warung  =   require("../models/sc_warung"),
        info    =   require("../models/sc_infoWarung"),
        meja    =   require("../models/sc_pesanMeja"),
        katr    =   require("../models/sc_pesanKat"),
        fileQR  =   require("../models/sc_qr"),
        menu    =   require("../models/sc_menuWarung"),
        orderM  =   require("../models/sc_orderMeja"),
        conn    =   require('../models/sc_database'),        
    idInfo_acak =   Math.floor(Math.random() * Math.floor(999999)),    
    idMenu_acak =   Math.floor(Math.random() * Math.floor(999999)),
    idMeja_acak =   Math.floor(Math.random() * Math.floor(999999)),
    idKatr_acak =   Math.floor(Math.random() * Math.floor(999999))

//############################################################################################ GET
//#################################################################################################
exports.index=(req,res)=>{      
  const tokens = req.cookies.ajI2YW52QXM3;  
  if (!tokens) {
    warung.findAll().then(allwarung=>{ 
    return  res.render('welcome',{data:0,warong:allwarung})
    })
    }
    jwt.verify(tokens, "%SESSION_ANONYMOUS%", (err, decoded) => {        
      if(err){ 
        warung.findAll().then(allwarung=>{ 
         return res.render('welcome',{data:0,warong:allwarung})
       })
      }
      else{
        users.findOne({where:{id_user : decoded.idUser}})
        .then(user=>{            
          warung.findAll().then(allwarung=>{                    
            return  res.render('welcome',{data:user,warong:allwarung})        
          })            
        })
      }
  });    
}

exports.lihatWarung=(req,res)=>{  
  const idWarung = req.params.id  
  warung.findOne({where:{infoWarung : idWarung}}).then(warong=>{     
    if(warong){
    const asd = warong.menuWarung       
   var sql= "SELECT warungs.id_warung , warungs.nama_warung , warungs.infoWarung , warungs.deskripsi , warungs.menuWarung , id_infoWarung , jamBuka , jamTutup , total_b , hp , S_tempat , S_katering , lokasi FROM warungs"
    +" INNER JOIN info_warungs ON warungs.infoWarung = info_warungs.id_warung WHERE infoWarung = ? "                        
    conn.db.query(sql,idWarung,(err,hasil)=>{        
      var dino = hari.toLowerCase()                                
      var tes1 = jam.split(":")[0]
      var tes2 = jam.split(":")[1]            
      var waktusaiki = tes1+','+tes2      

      var jamBuka = hasil[0].jamBuka      
      var jamTutup = hasil[0].jamTutup
      var ver1 = jamBuka.split(":")[0] , ver2 = jamBuka.split(":")[1]
      var ver3 = jamTutup.split(":")[0] , ver4 = jamTutup.split(":")[1]
      //done
      var jbk = ver1+','+ver2      
      var jtp = ver3+','+ver4          
            
      console.log(dino);
      menu.findAll({where:{id_warung : asd}}).then(ok=>{               
        if('friday' == dino){
          warung.update({bukatutup : 0},{where : {infoWarung : idWarung}}).then(updateTutup=>{
            res.render('page_lihatW',{
              data : hasil[0], status:'Tutup' ,   ko:ok         })         
            })
        }
        if(waktusaiki >= jbk && waktusaiki < jtp){   
            warung.update({bukatutup : 1},{where : {infoWarung : idWarung}}).then(updateBuka=>{
            res.render('page_lihatW',{data : hasil[0], status:'Buka' ,     ko:ok   })          
          })      
        }        
        else{
          warung.update({bukatutup : 0},{where : {infoWarung : idWarung}}).then(updateTutup=>{
          res.render('page_lihatW',{
            data : hasil[0], status:'Tutup' ,   ko:ok         })         
          })
        }                                       
      })
    })   
  }
  else{
    req.session.message = {
      type: 'danger',
      intro: 'ERROR !',
      message: 'Terjadi Kesalahan'
    } 
    res.redirect('/')
  }
  })
  
}

exports.warung=(req,res)=>{  
  users.findOne({where:{id_user:req.decoded.idUser}}).then(user=>{    
    const idUser = user.id_user
    warung.findOne({where:{id_pemilik : user.id_user}}).then(cekWarung=>{
        if(cekWarung){                   
              var sql =
                "SELECT warungs.id_warung , warungs.nama_warung , warungs.deskripsi , id_infoWarung , jamBuka , jamTutup , total_b , hp , S_tempat , S_katering , lokasi FROM warungs"
                +" INNER JOIN info_warungs ON warungs.infoWarung = info_warungs.id_warung WHERE id_pemilik = ? "                        
                conn.db.query(sql,idUser,(err,hasil)=>{                                     
                  res.render('page_warung',{data : hasil[0]})
                })                          
        }
        else{
         res.render('page_warung',{data : 0})
        }
    })
  })
}
exports.menuWarung=(req,res)=>{  
  users.findOne({where:{id_user:req.decoded.idUser}}).then(user=>{    
        var sql = 
        "SELECT warungs.nama_warung ,id_menuWarung , nama_menu , harga_menu , desk_menu FROM warungs"
        +" INNER JOIN menu_warungs ON warungs.menuWarung = menu_warungs.id_warung WHERE id_pemilik = ?";  
        conn.db.query(sql,user.id_user,(err,hasil)=>{
          if(hasil){            
            res.render('page_menuW',{data:hasil})
          }
          else{
            res.render('page_menuW',{data : 0})
          }
        })
  })
}
exports.hapusMenu=(req,res)=>{
  idBarang = req.params.id
  users.findOne({where:{id_user : req.decoded.idUser}}).then(user=>{
    menu.findOne({where:{id_menuWarung : idBarang}}).then(cekBarang=>{
      if(cekBarang){
          warung.findOne({where:{menuWarung : cekBarang.id_warung}}).then(cekWarung=>{
            if(cekWarung.id_pemilik != user.id_user){
              req.session.message = {
                type: 'danger',
                intro: 'ERROR !',
                message: 'Menu Makanan Tidak Tersedia'
              }  
              res.redirect('/Adminmenu')
            }
            else{
              menu.destroy({where:{id_menuWarung : idBarang}}).then(selesai=>{
                req.session.message = {
                  type: 'success',
                  intro: 'Berhasil ',
                  message: 'Menu Makanan Sudah Dihapus'
                }  
                res.redirect('/Adminmenu')
              })
            }
          })
      }
      else{
        req.session.message = {
          type: 'danger',
          intro: 'ERROR !',
          message: 'Menu Makanan Tidak Tersedia'
        }  
        res.redirect('/Adminmenu')
      }
    })
  })
}

exports.cari=(req,res)=>{
  var q = url.parse(req.url, true);
  if(q.pathname == "/search/" && req.method === "GET"){    
    var keyword = q.query.keyword;        
    var sql = "SELECT * FROM menu_warungs WHERE nama_menu LIKE '%"+ keyword +"%'"
    conn.db.query(sql,(err,hasil)=>{
      if(hasil != ''){
        res.render('page_search',{dataCari : hasil})
      }
      else{
        res.render('page_search',{dataCari : 0})
      }
    })
  }
}
exports.katering=(req,res)=>{
  users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{
    warung.findOne({where:{id_pemilik : wong.id_user}}).then(warong=>{
      console.log(warong.katerWarung);
      katr.findAll({where:{id_warung : warong.katerWarung}}).then(cekKatering=>{
        console.log(cekKatering);
        if(cekKatering == 0){
          res.render('page_katerW',{data : 0})
        }else{
          res.render('page_katerW',{data : cekKatering})
        }
      })      
    })
  })
}
exports.tempat=(req,res)=>{
  users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{
    warung.findOne({where:{id_pemilik : wong.id_user}}).then(warong=>{      
      meja.findAll({where:{id_warung : warong.mejaWarung}}).then(tempate=>{    

        if(tempate){          
          res.render('page_tempatW',{data:tempate})
        }else{          
          res.render('page_tempatW',{data:0})
        }
      })
    })
  })
}

exports.hapusTmpt=(req,res)=>{
  const ids = req.params._qwe
  users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{
    warung.findOne({where:{id_pemilik:wong.id_user}}).then(warong=>{
      meja.destroy({where :{nomer_meja : ids , id_warung : warong.mejaWarung}}).then(cekTempat=>{
        if(cekTempat){
          req.session.message = {
            type: 'success',
            intro: 'Berhasil ',
            message: 'Meja Sudah dihapus'
          }  
          res.redirect('/Admintempat')   
        }else{
          req.session.message = {
            type: 'danger',
            intro: 'ERROR !',
            message: 'Terjadi Kesalahan'
          }  
          res.redirect('/Admintempat')   
        }
      })
    })
  })
}

exports.mejaaktif=(req,res)=>{          // KONDISI MEJO ne == DISEWA kate diubah ng TIDAK DISEWA
  const nomer_meja = req.params._id
  users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{
    warung.findOne({where:{id_pemilik:wong.id_user}}).then(warong=>{  
      meja.findOne({where:{nomer_meja : nomer_meja , id_warung : warong.mejaWarung}}).then(tes=>{
        if(tes){
          meja.update({id_pemesan : 0 , nama_pemesan : '-'},{where:{id_pesan : tes.id_pesan}}).then(ok=>{
            req.session.message = {
              type: 'success',
              intro: 'Berhasil ',
              message: 'Status Meja Sudah berubah'
            }  
            res.redirect('/Admintempat') 
          })
        }else{
          req.session.message = {
            type: 'danger',
            intro: 'ERROR !',
            message: 'Terjadi Kesalahan'
          }  
          res.redirect('/Admintempat')   
        }
      })      
    })
  })
} 
exports.mejanonak=(req,res)=>{            //KONDISI MEJO ne tidak disewa
  const nomerc_meja = req.params._id  
  users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{
    warung.findOne({where:{id_pemilik:wong.id_user}}).then(warong=>{      
      meja.update({id_pemesan : 1 },{where :{nomer_meja : nomerc_meja , id_warung : warong.mejaWarung}}).then(cekTempat=>{
        if(cekTempat){
          req.session.message = {
            type: 'success',
            intro: 'Berhasil ',
            message: 'Status Meja Sudah berubah'
          }  
          res.redirect('/Admintempat')   
        }else{
          req.session.message = {
            type: 'danger',
            intro: 'ERROR !',
            message: 'Terjadi Kesalahan'
          }  
          res.redirect('/Admintempat')   
        }
      })
    })
  })
}

exports.cekTempat=(req,res)=>{
  ids = req.params._id
  users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{
    warung.findOne({where : { infoWarung : ids}}).then(cariW=>{
      if(cariW){
        meja.findAll({where : {id_warung : cariW.mejaWarung}}).then(tempate=>{
          orderM.findAll({where:{}})
          res.render('page_lihatT',{data : tempate})
        })
      }else{
        req.session.message = {
          type: 'danger',
          intro: 'ERROR !',
          message: 'Terjadi Kesalahan'
        }
        res.redirect('/')
      }
    })
  })
}



















//################################################################################################
//############################################################################################ POST
//#################################################################################################
exports.addWarung=(req,res)=>{  
  users.findOne({where:{id_user:req.decoded.idUser}}).then(user=>{
    var dataWarung = {
      id_pemilik  : user.id_user,
      nama_warung : req.body.namaWar,
      deskripsi   : req.body.deskripsi,
      infoWarung  : idInfo_acak,      
      menuWarung  : idMenu_acak,
      mejaWarung  : idMeja_acak,
      katerWarung : idKatr_acak
    }    
    warung.findOne({where:{id_pemilik : user.id_user}}).then(cekAddWarung=>{
      if(cekAddWarung){
        req.session.message = {
          type: 'warning',
          intro: 'info !',
          message: 'Anda Diperbolehkan Menambah 1 Warung / Restaurant Saja'
        }  
        res.redirect('/warung')
      }
      else{
        warung.create(dataWarung).then(buatWarung=>{
          var data2={
            lokasi : req.body.lokasi,
            jamBuka: req.body.jb,
            jamTutup: req.body.jt,
            hp      : req.body.hp,
            id_warung: dataWarung.infoWarung
          }
          info.create(data2).then(tambahInfo=>{
            req.session.message = {
              type: 'success',
              intro: 'Berhasil ',
              message: 'Warung sudah ditambahkan'
            }  
            res.redirect('/warung')
          })
        })
      }
    })
  })
}

exports.addMenu=(req,res)=>{
  users.findOne({where:{id_user:req.decoded.idUser}}).then(user=>{
    warung.findOne({where:{id_pemilik : user.id_user}}).then(dataWarung=>{
      var data={
        nama_menu : req.body.namaMak,
        harga_menu: req.body.hargaMak,
        desk_menu : req.body.deskripsi,
        id_warung : dataWarung.menuWarung
      }
      menu.create(data).then(tambahMenu=>{
        info.create({})
        req.session.message = {
          type: 'success',
          intro: 'Berhasil ',
          message: 'Menu sudah ditambahkan'
        }  
        res.redirect('/Adminmenu')
      })
    })
  })
}

exports.editMenu=(req,res)=>{
  var idBarang = req.body.idne
  var data={    
    nama_menu  : req.body.namaMak,
    harga_menu : req.body.hargaMak,
    desk_menu  : req.body.deskripsi
  }  
    if(data.nama_warung == '' || data.harga_menu == '' || data.desk_menu == ''){
      console.log("Dilarang Kosong");
    }else{
        users.findOne({where:{id_user : req.decoded.idUser}}).then(user=>{
          menu.findOne({where:{id_menuWarung : idBarang}}).then(cekBarang=>{
            if(cekBarang){
                warung.findOne({where:{menuWarung : cekBarang.id_warung}}).then(cekWarung=>{
                  if(cekWarung.id_pemilik != user.id_user){
                    req.session.message = {
                      type: 'danger',
                      intro: 'ERROR !',
                      message: 'Menu Makanan Tidak Tersedia'
                    }  
                    res.redirect('/Adminmenu')
                  }
                  else{                                                            
                    menu.update(data,{where:{id_menuWarung : cekBarang.id_menuWarung}}).then(selesai=>{
                      req.session.message = {
                        type: 'success',
                        intro: 'Berhasil !',
                        message: 'Menu Makanan sudah di update'
                      }  
                      res.redirect('/Adminmenu')
                    })
                  }
                })
            }
            else{
              req.session.message = {
                type: 'danger',
                intro: 'ERROR !',
                message: 'Menu Makanan Tidak Tersedia'
              }  
              res.redirect('/Adminmenu')
            }
          })
        })
      }
}

exports.edit1Warung = (req,res)=>{
  var idne = req.body.idne
  var data={
    nama_warung : req.body.namaWar,
    deskripsi   : req.body.deskripsi
  }
  users.findOne({where:{id_user:req.decoded.idUser}}).then(user=>{
    warung.findOne({where:{id_pemilik : user.id_user}}).then(cekWarung=>{
      if(cekWarung){
        warung.update(data,{where:{id_warung : idne}}).then(updateWarung=>{
            if(updateWarung){
              req.session.message = {
                type: 'success',
                intro: 'Berhasil !',
                message: 'Sukses update data'
              }  
              res.redirect('/warung')
            }else{
              res.redirect('/warung')
            }
        })
      }
      else{
        req.session.message = {
          type: 'danger',
          intro: 'Gagal !',
          message: 'terjadi Kesalahan'
        }  
        res.redirect('/warung')
      }
    })
  })
}
exports.edit2Warung = (req,res)=>{
  var idne = req.body.idne
  var data={
    lokasi      : req.body.lokasi,
    jamBuka     : req.body.jb,
    jamTutup    : req.body.jt,
    hp          : req.body.hp
  }
  users.findOne({where:{id_user:req.decoded.idUser}}).then(user=>{    
      info.update(data,{where:{id_infoWarung : idne}}).then(updateWarung=>{        
          if(updateWarung){
            req.session.message = {
              type: 'success',
              intro: 'Berhasil !',
              message: 'Sukses update data'
            }  
            res.redirect('/warung')
          }else{
            res.redirect('/warung')
          }
      })    
  })
}

exports.ubahSTa=(req,res)=>{
  users.findOne({where:{id_user : req.decoded.idUser}}) .then(user=>{
    warung.findOne({where:{id_pemilik : user.id_user}}).then(warong=>{                        
        info.update({S_tempat : 1},{where:{id_warung : warong.infoWarung}}).then(updateAktif=>{               
          res.redirect('/warung')
        })            
    })
  })
}
exports.ubahSTn=(req,res)=>{
  users.findOne({where:{id_user : req.decoded.idUser}}) .then(user=>{
    warung.findOne({where:{id_pemilik : user.id_user}}).then(warong=>{            
      info.update({S_tempat : 0},{where:{id_warung : warong.infoWarung}}).then(updateNonAktif=>{      
        res.redirect('/warung')
      })
    })
  })
}
exports.ubahSKa=(req,res)=>{
  users.findOne({where:{id_user : req.decoded.idUser}}) .then(user=>{
    warung.findOne({where:{id_pemilik : user.id_user}}).then(warong=>{      
      info.update({S_katering : 1},{where:{id_warung : warong.infoWarung}}).then(updateNonAktif=>{      
        res.redirect('/warung')
      })
    })
  })
}
exports.ubahSKn=(req,res)=>{
  users.findOne({where:{id_user : req.decoded.idUser}}) .then(user=>{
    warung.findOne({where:{id_pemilik : user.id_user}}).then(warong=>{      
      info.update({S_katering : 0},{where:{id_warung : warong.infoWarung}}).then(updateNonAktif=>{      
        res.redirect('/warung')
      })
    })
  })
}
exports.addMeja=(req,res)=>{
  users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{
    warung.findOne({where:{id_pemilik : wong.id_user}}).then(warong=>{
      var data={        
        id_pesan : idMeja_acak,
        nama_pemesan : '-',
        nomer_meja : req.body.nomMeja,
        keterangan : req.body.ketMeja,
        id_warung : warong.mejaWarung
      }
      meja.findOne({where:{nomer_meja : data.nomer_meja , id_warung : warong.mejaWarung}}).then(cekMeja=>{
        if(cekMeja > 0){
          req.session.message = {
            type: 'warning',
            intro: 'Warning !',
            message: 'Nomer Meja Sudah terdaftar pada restaurant Anda'
          }  
          res.redirect('/Admintempat')          
        }
        else{
          meja.create(data).then(tambahMeja=>{
            res.redirect('/Admintempat')            
          })
        }
      })
    })
  })
}
