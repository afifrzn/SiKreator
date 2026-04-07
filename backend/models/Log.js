import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Log = sequelize.define('Log', {
  id: { type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
  post_id: { type: DataTypes.INTEGER(11), allowNull: false },
  message: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('success', 'error'), allowNull: false }
}, { 
  tableName: 'logs', 
  createdAt: 'created_at', 
  updatedAt: false 
});

export default Log;