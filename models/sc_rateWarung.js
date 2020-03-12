const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "rate_warung",
  {
    id_rateWarung: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true
    },
    b1:{
        type:Sequelize.INTEGER
    },
    b2: {
        type: Sequelize.INTEGER
    },
    b3:{
        type:Sequelize.INTEGER
    },
    b4 :{
        type:Sequelize.INTEGER
    },
    b5 :{
        type:Sequelize.INTEGER
    },
    total_bintang :{
        type:Sequelize.STRING
    },
    total_jumlah :{
        type:Sequelize.INTEGER
    },
    id_warung :{
        type:Sequelize.INTEGER
    }
  },
  { timestamps: false }
);
