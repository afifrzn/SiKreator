import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InstagramAccount = sequelize.define('InstagramAccount', {
  id: { type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER(11), allowNull: false },
  username: { type: DataTypes.STRING(100), allowNull: false },
  access_token: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'instagram_accounts', createdAt: 'created_at', updatedAt: false });

export default InstagramAccount;