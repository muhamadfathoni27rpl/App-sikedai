const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "pmeja_orders",
  {
    id_pemesananMeja: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true
    },
    kunci_meja :{
        type:Sequelize.INTEGER
    },
    id_pemesan:{
        type:Sequelize.INTEGER
    },
    nama_pemesan :{
      type : Sequelize.STRING
    },
    ket_waktu1 :{
      type: 'TIMESTAMP',
      defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
    },
    ket_waktu2:{
      type: Sequelize.DATE
    },
    ket_waktu3:{
      type:Sequelize.TIME
    },
    status:{
      type:Sequelize.INTEGER
    },        
  },
  { timestamps: false }
);
