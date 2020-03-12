const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "warung",
  {
    id_warung: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true
    },
    id_pemilik:{
      type:Sequelize.INTEGER
    },
    nama_warung: {
        type: Sequelize.STRING
    },
    deskripsi:{
      type:Sequelize.STRING      
    },
    infoWarung:{
      type:Sequelize.INTEGER
    },
    menuWarung:{
      type:Sequelize.INTEGER
    },
    mejaWarung:{
      type:Sequelize.INTEGER
    },
    katerWarung:{
      type:Sequelize.INTEGER
    },
    bukatutup:{
      type:Sequelize.INTEGER
    }
  },
  { timestamps: false }
);
