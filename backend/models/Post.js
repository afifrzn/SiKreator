import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER(11), allowNull: false },
  instagram_account_id: { type: DataTypes.INTEGER(11), allowNull: false },
  media_url: { type: DataTypes.TEXT, allowNull: false },
  caption: { type: DataTypes.TEXT },
  scheduled_at: { type: DataTypes.DATE },
  status: { 
    type: DataTypes.ENUM('draft', 'scheduled', 'processing', 'posted', 'failed'),
    defaultValue: 'draft'
  },
  retry_count: { type: DataTypes.INTEGER(11), defaultValue: 0 }
}, { 
  tableName: 'posts', 
  createdAt: 'created_at', 
  updatedAt: false 
});

export default Post;