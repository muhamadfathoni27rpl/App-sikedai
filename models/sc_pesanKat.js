const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "pket_warung",
  {
    id_katering: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true
    },
    id_pemesan:{
        type:Sequelize.INTEGER
    },
    id_warung: {
        type: Sequelize.INTEGER
    },
    makanan:{
        type:Sequelize.TEXT
    },        
  },
  { timestamps: false }
);
