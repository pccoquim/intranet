// backend/src/models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('user', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    token: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE },
    updated_by: { type: DataTypes.INTEGER }
}, {
    timestamps: false,
    tableName: 'user'
});

export default User;