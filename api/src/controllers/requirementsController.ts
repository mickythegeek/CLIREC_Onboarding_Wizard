import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import AccountRequirement from '../models/AccountRequirement';
import User from '../models/User';

export const createRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const { clientName, clientId, region, responseJson, status } = req.body;

        const requirement = await AccountRequirement.create({
            user_id: req.user.id,
            client_name: clientName,
            client_id: clientId,
            region,
            response_json: responseJson,
            status: status || 'Draft'
        });

        res.status(201).json(requirement);
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
        res.json(requirements);
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
        res.json(requirement);
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

        const { clientName, clientId, region, responseJson, status } = req.body;

        await requirement.update({
            client_name: clientName,
            client_id: clientId,
            region,
            response_json: responseJson,
            status
        });

        res.json(requirement);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteRequirement = async (req: AuthRequest, res: Response) => {
    try {
        const deleted = await AccountRequirement.destroy({
            where: { id: req.params.id, user_id: req.user.id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Requirement not found' });
        }
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

        // Transform to flat structure for frontend to match previous API contract
        const data = requirements.map((r: any) => ({
            ...r.toJSON(),
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
        res.json(requirement);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
