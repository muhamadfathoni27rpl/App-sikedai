const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "users_qr",
  {
    id_qr: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true
    },
    id_user:{
        type:Sequelize.INTEGER
    },
    gambar_qr: {
        type: Sequelize.STRING
    },
    id_meja:{
        type:Sequelize.INTEGER
    },
    status:{
      type:Sequelize.INTEGER
    }     
  },
  { timestamps: false }
);
