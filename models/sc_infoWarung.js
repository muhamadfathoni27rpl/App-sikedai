const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "info_warung",
  {
    id_infoWarung: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true
    },
    lokasi:{
        type:Sequelize.STRING
    },
    jamBuka: {
        type: Sequelize.STRING
    },
    jamTutup:{
        type:Sequelize.STRING
    },
    hp :{
        type:Sequelize.INTEGER
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
    total_b :{
        type:Sequelize.INTEGER
    },
    rate_b :{
        type:Sequelize.STRING
    },
    S_tempat:{
        type:Sequelize.INTEGER
    },
    S_katering:{
        type:Sequelize.INTEGER
    },
    id_warung :{
        type:Sequelize.INTEGER
    }
  },
  { timestamps: false }
);
