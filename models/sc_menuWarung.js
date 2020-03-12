const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "menu_warung",
  {
    id_menuWarung: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true
    },
    nama_menu:{
        type:Sequelize.STRING
    },
    harga_menu: {
        type: Sequelize.INTEGER
    },
    desk_menu:{
        type:Sequelize.STRING
    },    
    id_warung :{
        type:Sequelize.INTEGER
    }
  },
  { timestamps: false }
);
