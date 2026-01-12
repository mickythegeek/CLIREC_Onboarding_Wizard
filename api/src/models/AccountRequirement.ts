import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class AccountRequirement extends Model {
    public id!: number;
    public user_id!: number;
    public client_name!: string;
    public client_id!: string;
    public region!: string;
    public response_json!: string;
    public status!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

AccountRequirement.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        client_name: {
            type: DataTypes.STRING(255),
            defaultValue: '',
        },
        client_id: {
            type: DataTypes.STRING(100),
            defaultValue: '',
        },
        region: {
            type: DataTypes.STRING(100),
            defaultValue: '',
        },
        response_json: {
            type: DataTypes.TEXT,
            defaultValue: '{}',
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'Draft',
        },
    },
    {
        sequelize,
        tableName: 'account_requirements',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

// Define associations
User.hasMany(AccountRequirement, { foreignKey: 'user_id', as: 'accountRequirements' });
AccountRequirement.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default AccountRequirement;
