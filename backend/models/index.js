import sequelize from '../config/database.js';
import User from './User.js';
import Account from './Account.js'; // Ganti dari InstagramAccount
import Post from './Post.js';
import Media from './Media.js';

// Relasi User -> Account
User.hasMany(Account, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Account.belongsTo(User, { foreignKey: 'user_id' });

// Relasi Account -> Post
Account.hasMany(Post, { foreignKey: 'account_id', onDelete: 'CASCADE' });
Post.belongsTo(Account, { foreignKey: 'account_id' });

// Relasi User -> Media
User.hasMany(Media, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Media.belongsTo(User, { foreignKey: 'user_id' });

// Relasi Media -> Post
Media.hasMany(Post, { foreignKey: 'media_id' });
Post.belongsTo(Media, { foreignKey: 'media_id' });

export { sequelize, User, Account, Post, Media };