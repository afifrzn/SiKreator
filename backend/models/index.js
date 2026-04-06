import sequelize from '../config/database.js';
import User from './User.js';
import InstagramAccount from './InstagramAccount.js';
import Post from './Post.js';

// Relasi
User.hasMany(InstagramAccount, { foreignKey: 'user_id', onDelete: 'CASCADE' });
InstagramAccount.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Post, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'user_id' });

InstagramAccount.hasMany(Post, { foreignKey: 'instagram_account_id', onDelete: 'CASCADE' });
Post.belongsTo(InstagramAccount, { foreignKey: 'instagram_account_id' });

export { sequelize, User, InstagramAccount, Post };