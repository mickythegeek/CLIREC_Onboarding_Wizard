import AuditLog, { AuditAction } from '../models/AuditLog';

interface AuditLogParams {
    requirementId: number;
    userId: number;
    action: AuditAction;
    changes?: Record<string, any>;
    previousValues?: Record<string, any>;
}

export const logAudit = async ({
    requirementId,
    userId,
    action,
    changes = {},
    previousValues,
}: AuditLogParams): Promise<void> => {
    try {
        await AuditLog.create({
            requirement_id: requirementId,
            user_id: userId,
            action,
            changes: JSON.stringify(changes),
            previous_values: previousValues ? JSON.stringify(previousValues) : null,
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw - audit logging should not break the main operation
    }
};

export const getAuditHistory = async (requirementId: number) => {
    return AuditLog.findAll({
        where: { requirement_id: requirementId },
        order: [['created_at', 'DESC']],
        include: [
            {
                association: 'user',
                attributes: ['id', 'email', 'full_name']
            }
        ],
    });
};

export const transformAuditLog = (log: any) => ({
    id: log.id,
    requirementId: log.requirement_id,
    userId: log.user_id,
    action: log.action,
    changes: log.changes ? JSON.parse(log.changes) : {},
    previousValues: log.previous_values ? JSON.parse(log.previous_values) : null,
    createdAt: log.created_at,
    userName: log.user?.full_name || log.user?.email || 'Unknown',
    userEmail: log.user?.email,
});
