const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "user",
  {
    id_user: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true
    },
    nama:{
        type:Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    pass:{
        type:Sequelize.STRING
    },
    hp :{
        type:Sequelize.INTEGER
    },
    info :{
        type:Sequelize.INTEGER
    }
  },
  { timestamps: false }
);
