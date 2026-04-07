import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Account = sequelize.define('Account', {
  id: { 
    type: DataTypes.INTEGER(11), 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: { 
    type: DataTypes.INTEGER(11), 
    allowNull: false 
  },
  username: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  session: { 
    type: DataTypes.TEXT, 
    allowNull: true, // Diubah jadi true agar tidak error 500 saat dikosongkan
    defaultValue: '' 
  },
  status: { 
    type: DataTypes.ENUM('active', 'expired'), 
    defaultValue: 'active' 
  }
}, { 
  tableName: 'accounts', 
  createdAt: 'created_at', 
  updatedAt: false 
});

export default Account;