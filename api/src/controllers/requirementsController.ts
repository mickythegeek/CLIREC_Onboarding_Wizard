import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import AccountRequirement from '../models/AccountRequirement';
import User from '../models/User';

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

        const { clientName, clientId, region, responseJson, status } = req.body;

        await requirement.update({
            client_name: clientName,
            client_id: clientId,
            region,
            response_json: responseJson,
            status
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

        await requirement.destroy();
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

        await requirement.update({ status: req.body.status });
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

        const { clientName, clientId, region, responseJson, status } = req.body;

        await requirement.update({
            client_name: clientName,
            client_id: clientId,
            region,
            response_json: responseJson,
            status
        });

        res.json(transformRequirement(requirement));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
