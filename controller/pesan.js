const   jwt     =   require('jsonwebtoken'),        
        qrm     =   require('qr-image'),
        fs      =   require('fs'),        
        waktu   =   require('date-and-time'),
        forD    =   new Date(),        
        bulan   =   waktu.format(forD, 'MM')       
        tglCnf  =   waktu.format(forD, 'DD')  
        jam     =   waktu.format(forD, 'HH:mm'),
        users   =   require('../models/sc_auth'),
        warung  =   require("../models/sc_warung"),
        info    =   require("../models/sc_infoWarung"),
        meja    =   require("../models/sc_pesanMeja"),
        katr    =   require("../models/sc_pesanKat"),
        menu    =   require("../models/sc_menuWarung"),
        fileQR  =   require("../models/sc_qr"),
        conn    =   require('../models/sc_database'),        
    idInfo_acak =   Math.floor(Math.random() * Math.floor(999999)),    
    idMenu_acak =   Math.floor(Math.random() * Math.floor(999999)),
    idMeja_acak =   Math.floor(Math.random() * Math.floor(999999)),
    idKatr_acak =   Math.floor(Math.random() * Math.floor(999999))


//GET

exports.pembayaran = (req,res)=>{
    const as = req.params.tokencash  
    if (!as) return res.status(401).redirect("/");
      jwt.verify(as, "%pembayaranUSER%", (err, cash) => {
        if(err){res.redirect('/')}
        else{
          meja.findOne({where:{id_pesan : cash.datane}}).then(warong=>{
            res.render('page_order',{data : warong })
          })
        }
    });     
  } 

exports.bayar=(req,res)=>{  
    const idP = req.params.id   
    const ipt = {
      ket_waktu2 : req.body.tanggal ,
      ket_waktu3 : req.body.jam
    }    
    if(!req.session.pembayaran){
      req.session.message = {
        type: 'danger',
        intro: 'ERROR !',
        message: 'Terjadi Kesalahan'
      }  
      res.redirect('/')
    }
    else{                
      users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{
        meja.findOne({where:{id_pesan : idP}}).then(cekMeja=>{
          if(cekMeja){            
            var tanggalDepan = forD.getDate()+1                                    
            var tahun        = forD.getFullYear()
            var e = ipt.ket_waktu2
            var tIpt = e.split("-")[2]      
            var bIpt = e.split("-")[1]
            var thIpt = e.split("-")[0]            
            if(tIpt <= tanggalDepan && bIpt == bulan && thIpt == tahun){              
              if(tIpt < tglCnf){
                console.log("error");                
                req.session.message = {
                  type: 'danger',
                  intro: 'ERROR !',
                  message: 'Terjadi Kesalahan'                  
                }  
                console.log("Pesan hari Kemarin");
                res.redirect('/')                
              }else{                                                        
                // var akhirBulan = new Date(tahun, forD.getMonth() + 1, 0);
                // var tess = akhirBulan.split("-","T")[2]
                // console.log(tess);
                // if(akhirBulan)
                // if(saldo >= 5000){                       
                  meja.update({id_pemesan : wong.id_user,nama_pemesan : wong.nama},{where:{id_warung : cekMeja.id_warung , id_pesan : idP}}).then(done=>{
                    req.decoded.orderan = true
                    res.redirect('/nextPesan/'+cekMeja.nomer_meja+'/'+cekMeja.id_warung)
                  })
                // }else{
                //   req.session.message = {
                //     type: 'danger',
                //     intro: 'ERROR !',
                //     message: 'Dana Tidak Mencukupi'
                //   }  
                //   res.redirect('/')
                // } 
              }
            }else{
              req.session.message = {
                type: 'danger',
                intro: 'ERROR !',
                message: 'Maksimal Pemesanan 1 hari dari sekarang'
              }  
              res.redirect('/')
            }
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
}  


exports.pesanT=(req,res)=>{           // http://localhost/pesan

    users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{    
      meja.findOne({where:{nomer_meja : req.params._mejane , id_warung : req.params._wr}}).then(warong=>{      
        if(warong){
          warung.findOne({where:{mejaWarung : warong.id_warung}}).then(cekLagi=>{ 
            console.log(cekLagi);
            if(cekLagi.bukatutup == 1)         {
              if(cekLagi.id_pemilik == wong.id_user){
                req.session.message = {
                  type: 'danger',
                  intro: 'ERROR !',
                  message: 'Tidak Dapat Memesan Tempat Anda Sendiri'
                }  
                res.redirect('/')
              }else{                                    
                  const data ={datane : warong.id_pesan}
                  const token = jwt.sign(data, "%pembayaranUSER%", {expiresIn: 900000}); 
                  req.session.pembayaran = true
                  res.redirect('/pembayaran/'+token)
              }
            }else{
              req.session.message = {
                type: 'danger',
                intro: 'ERROR !',
                message: 'Restaurant / Warung Tutup'
              }  
              res.redirect('/')
            }
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
    })
  }
  
  
  
  
exports.nextPesanT=(req,res)=>{         //TAHAP AKHIR GENERATE QR
    if(!req.session.pembayaran && !req.session.orderan){
      req.session.message = {
        type: 'danger',
        intro: 'ERROR !',
        message: 'Terjadi Kesalahan'
      }  
      res.redirect('/')
    }
    else{
    users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{    
      meja.findOne({where:{nomer_meja : req.params._mejane , id_warung : req.params._wr}}).then(warong=>{      
        if(warong){
          warung.findOne({where:{mejaWarung : warong.id_warung}}).then(cekLagi=>{
            if(cekLagi.id_pemilik == wong.id_user){
              req.session.message = {
                type: 'danger',
                intro: 'ERROR !',
                message: 'Tidak Dapat Memesan Tempat Anda Sendiri'
              }  
              res.redirect('/')
            }else{            
              const data = {
                idMeja      : req.params._mejane,
                idRest      : req.params._wr,
                idPembeli   : wong.id_user,
                pembeli     :  wong.nama
                };
              const token = jwt.sign(data, "%generateQR%", {expiresIn: "2h"});      
                let urlKonfirmasi = ('http://localhost/confirm/tempat/'+token)    
                var gambare = qrm.imageSync(urlKonfirmasi,{ type: 'png'})  
                let codeKonfirmasi = new Date().getTime() + '.png';
                fs.writeFileSync('./public/qr/' + codeKonfirmasi, gambare, (err) => {
                    if(err){console.log(err);}      
                })  
                var dataGambar = "qr/" + codeKonfirmasi
                var nambahQR = {
                    id_user : wong.id_user,
                    gambar_qr : dataGambar,
                    id_meja :  warong.id_pesan ,
                    status : 0,                    
                }
                fileQR.create(nambahQR).then(selesai=>{
                    console.log(urlKonfirmasi);
                    req.session.pembayaran = false
                    res.render('page_generate',{data:dataGambar})
                })
            }
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
    })
   } 
  }
  
exports.konfirT=(req,res)=>{
    const as = req.params._as  
    if (!as) return res.status(401).redirect("/");
      jwt.verify(as, "%generateQR%", (err, qr) => {
        if(err){res.redirect('/')}
        else{
          users.findOne({where:{id_user : req.decoded.idUser}}).then(wong=>{
              warung.findOne({where:{mejaWarung : qr.idRest}}).then(warong=>{
                  meja.findOne({where:{nomer_meja : qr.idMeja , id_warung : warong.mejaWarung}}).then(cekMeja=>{
                      if(cekMeja){
                        if(wong.id_user == warong.id_pemilik){
                            // console.log("lanjut");
                            meja.update({id_pemesan : 0 , nama_pemesan : '-'},{where:{nomer_meja : qr.idMeja , id_warung : warong.mejaWarung}}).then(apdetMeja=>{
                                fileQR.update({status : 1},{where:{id_user : qr.idPembeli,id_meja : cekMeja.id_pesan}}).then(apdetqr=>{                                    
                                    req.session.message = {
                                        type: 'success',
                                        intro: 'Berhasil ',
                                        message: 'Sukses Chekout'
                                      }
                                    res.redirect('/')
                                })
                            })
                        }else{
                            req.session.message = {
                                type: 'danger',
                                intro: 'ERROR !',
                                message: 'Hanya Admin Restaurant Yang dapat mengakses URL ini'
                              }
                              res.redirect('/')
                        }
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
          })
        }
    });  
}

exports.history=(req,res)=>{
  users.findOne({where:{id_user:req.decoded.idUser}}).then(wong=>{
    fileQR.findAll({where:{id_user : wong.id_user,status : 0 }}).then(ok=>{   
      fileQR.findAndCountAll({where:{id_user : wong.id_user,status : 1}}).then(koun=>{               
        res.render('page_history',{data:ok ,status : ok , sukses : koun.count})
        })
      })               
    })
}