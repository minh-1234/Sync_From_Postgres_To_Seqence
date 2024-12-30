
import { sequelize } from '../config/connection.js'
import { DataTypes, UUID } from 'sequelize';
export const patient = sequelize.define('patient', {
  id: {
    type: DataTypes.INTEGER, allowNull: false,
    unique: false,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING, allowNull: true,
    unique: false,
    primaryKey: false,
    autoIncrement: false
  },
  lastName: {
    type: DataTypes.STRING, allowNull: true,
    unique: false,
    primaryKey: false,
    autoIncrement: false
  },
  email: {
    type: DataTypes.STRING, allowNull: true,
    unique: false,
    primaryKey: false,
    autoIncrement: false
  },
  createdAt: {
    type: DataTypes.DATE, allowNull: false,
    unique: false,
    primaryKey: false,
    autoIncrement: false
  }
});