import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import AccountRequirement from '../models/AccountRequirement';
import User from '../models/User';
import { logAudit, getAuditHistory, transformAuditLog } from '../services/auditService';

// Helper to transform snake_case DB fields to camelCase for frontend
const transformRequirement = (r: any) => ({
    id: r.id,
    userId: r.user_id,
    clientName: r.client_name,
    clientId: r.client_id,
    region: r.region,
    responseJson: r.response_json,
    status: r.status,
    isLocked: r.is_locked,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
});

export const createRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const { clientName, clientId, region, responseJson, status } = req.body;

        const requirement = await AccountRequirement.create({
            user_id: req.user.id,
            client_name: clientName,
            client_id: clientId,
            region,
            response_json: responseJson,
            status: status || 'Draft',
            is_locked: false
        });

        // Log audit
        await logAudit({
            requirementId: requirement.id,
            userId: req.user.id,
            action: 'CREATE',
            changes: { clientName, clientId, region, status: status || 'Draft' },
        });

        res.status(201).json(transformRequirement(requirement));
    } catch (error) {
        console.error('Create requirement error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyRequirements = async (req: AuthRequest, res: Response) => {
    try {
        const requirements = await AccountRequirement.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']]
        });
        res.json(requirements.map(transformRequirement));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const requirement = await AccountRequirement.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });

        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }
        res.json(transformRequirement(requirement));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const requirement = await AccountRequirement.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });

        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        // Check if locked - regular users cannot edit locked requirements
        if (requirement.is_locked) {
            return res.status(403).json({ message: 'This requirement is locked and cannot be modified' });
        }

        // Store previous values for audit
        const previousValues = {
            clientName: requirement.client_name,
            clientId: requirement.client_id,
            region: requirement.region,
            status: requirement.status,
        };

        const { clientName, clientId, region, responseJson, status } = req.body;

        await requirement.update({
            client_name: clientName,
            client_id: clientId,
            region,
            response_json: responseJson,
            status
        });

        // Log audit
        await logAudit({
            requirementId: requirement.id,
            userId: req.user.id,
            action: 'UPDATE',
            changes: { clientName, clientId, region, status },
            previousValues,
        });

        res.json(transformRequirement(requirement));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const requirement = await AccountRequirement.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });

        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        // Check if locked - regular users cannot delete locked requirements
        if (requirement.is_locked) {
            return res.status(403).json({ message: 'This requirement is locked and cannot be deleted' });
        }

        const reqId = requirement.id;
        const previousValues = {
            clientName: requirement.client_name,
            clientId: requirement.client_id,
            region: requirement.region,
            status: requirement.status,
        };

        await requirement.destroy();

        // Log audit
        await logAudit({
            requirementId: reqId,
            userId: req.user.id,
            action: 'DELETE',
            changes: { deleted: true },
            previousValues,
        });

        res.json({ message: 'Requirement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const downloadRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const requirement = await AccountRequirement.findOne({
            where: { id: req.params.id, user_id: req.user.id }
        });

        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=requirement_${requirement.id}.json`);
        res.send(requirement.response_json);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin Handlers
export const getAllRequirements = async (req: AuthRequest, res: Response) => {
    try {
        const requirements = await AccountRequirement.findAll({
            include: [{ model: User, as: 'user', attributes: ['id', 'email', 'full_name'] }],
            order: [['created_at', 'DESC']]
        });

        // Transform and add user info
        const data = requirements.map((r: any) => ({
            ...transformRequirement(r),
            userEmail: r.user?.email,
            userFullName: r.user?.full_name
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
    try {
        const requirement = await AccountRequirement.findByPk(req.params.id);
        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        const previousStatus = requirement.status;
        await requirement.update({ status: req.body.status });

        // Log audit
        await logAudit({
            requirementId: requirement.id,
            userId: req.user.id,
            action: 'STATUS_CHANGE',
            changes: { status: req.body.status },
            previousValues: { status: previousStatus },
        });

        res.json(transformRequirement(requirement));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Lock/Unlock handlers (Admin only)
export const lockRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const requirement = await AccountRequirement.findByPk(req.params.id);
        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        await requirement.update({ is_locked: true });

        // Log audit
        await logAudit({
            requirementId: requirement.id,
            userId: req.user.id,
            action: 'LOCK',
            changes: { isLocked: true },
            previousValues: { isLocked: false },
        });

        res.json({ message: 'Requirement locked successfully', ...transformRequirement(requirement) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const unlockRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const requirement = await AccountRequirement.findByPk(req.params.id);
        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        await requirement.update({ is_locked: false });

        // Log audit
        await logAudit({
            requirementId: requirement.id,
            userId: req.user.id,
            action: 'UNLOCK',
            changes: { isLocked: false },
            previousValues: { isLocked: true },
        });

        res.json({ message: 'Requirement unlocked successfully', ...transformRequirement(requirement) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin get single requirement (bypasses ownership check)
export const adminGetRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const requirement = await AccountRequirement.findByPk(req.params.id, {
            include: [{ model: User, as: 'user', attributes: ['id', 'email', 'full_name'] }]
        });

        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        const data = {
            ...transformRequirement(requirement),
            userEmail: (requirement as any).user?.email,
            userFullName: (requirement as any).user?.full_name
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin update requirement (bypasses ownership and lock checks)
export const adminUpdateRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const requirement = await AccountRequirement.findByPk(req.params.id);

        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }

        // Store previous values for audit
        const previousValues = {
            clientName: requirement.client_name,
            clientId: requirement.client_id,
            region: requirement.region,
            status: requirement.status,
        };

        const { clientName, clientId, region, responseJson, status } = req.body;

        await requirement.update({
            client_name: clientName,
            client_id: clientId,
            region,
            response_json: responseJson,
            status
        });

        // Log audit (admin edit)
        await logAudit({
            requirementId: requirement.id,
            userId: req.user.id,
            action: 'UPDATE',
            changes: { clientName, clientId, region, status, adminEdit: true },
            previousValues,
        });

        res.json(transformRequirement(requirement));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get audit history for a requirement (Admin only)
export const getRequirementAuditHistory = async (req: AuthRequest, res: Response) => {
    try {
        const logs = await getAuditHistory(parseInt(req.params.id));
        res.json(logs.map(transformAuditLog));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
