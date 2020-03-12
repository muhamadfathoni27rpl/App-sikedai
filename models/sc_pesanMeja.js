const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "pmeja_warung",
  {
    id_pesan: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true
    },
    nomer_meja: {
        type: Sequelize.TEXT
    },
    id_warung:{
      type:Sequelize.INTEGER
    },
    id_order:{
      type:Sequelize.INTEGER
    },
    keterangan:{
        type:Sequelize.STRING
    },        
  },
  { timestamps: false }
);
