import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import AccountRequirement from './AccountRequirement';

export type AuditAction =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'STATUS_CHANGE'
    | 'LOCK'
    | 'UNLOCK';

class AuditLog extends Model {
    public id!: number;
    public requirement_id!: number;
    public user_id!: number;
    public action!: AuditAction;
    public changes!: string; // JSON string of what changed
    public previous_values!: string | null; // JSON string of previous values
    public readonly created_at!: Date;
}

AuditLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        requirement_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: AccountRequirement,
                key: 'id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        action: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        changes: {
            type: DataTypes.TEXT,
            defaultValue: '{}',
        },
        previous_values: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'audit_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false, // We only care about creation time for logs
    }
);

// Define associations
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

AccountRequirement.hasMany(AuditLog, { foreignKey: 'requirement_id', as: 'auditLogs' });
AuditLog.belongsTo(AccountRequirement, { foreignKey: 'requirement_id', as: 'requirement' });

export default AuditLog;
