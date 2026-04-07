import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Media = sequelize.define('Media', {
  id: { type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER(11), allowNull: false },
  file_url: { type: DataTypes.TEXT, allowNull: false },
  file_type: { type: DataTypes.ENUM('image', 'video'), allowNull: false }
}, { 
  tableName: 'media', 
  createdAt: 'created_at', 
  updatedAt: false 
});

export default Media;