import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
  account_id: { type: DataTypes.INTEGER(11), allowNull: false },
  media_id: { type: DataTypes.INTEGER(11), allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false }, // Penanda pemilik konten
  caption: { type: DataTypes.TEXT },
  scheduled_time: { type: DataTypes.DATE },
  status: { 
    type: DataTypes.ENUM('pending', 'posted', 'failed'),
    defaultValue: 'pending'
  }
}, { 
  tableName: 'posts', 
  createdAt: 'created_at', 
  updatedAt: false 
});

export default Post;