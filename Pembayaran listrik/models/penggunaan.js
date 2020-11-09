'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class penggunaan extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.pelanggan, {
        foreignKey: 'id_pelanggan',
        as: 'pelanggan'
      })
    }
  };
  penggunaan.init({
    id_penggunaan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_pelanggan: DataTypes.INTEGER,
    bulan: DataTypes.STRING,
    tahun: DataTypes.STRING,
    meter_awal: DataTypes.FLOAT,
    meter_akhir: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'penggunaan',
    tableName: 'penggunaan'
  });
  return penggunaan;
};