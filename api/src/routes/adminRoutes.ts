import { Router } from 'express';
import * as reqController from '../controllers/requirementsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/requirements', authenticateToken, requireAdmin, reqController.getAllRequirements);
router.get('/requirements/:id', authenticateToken, requireAdmin, reqController.adminGetRequirement);
router.get('/requirements/:id/audit', authenticateToken, requireAdmin, reqController.getRequirementAuditHistory);
router.put('/requirements/:id', authenticateToken, requireAdmin, reqController.adminUpdateRequirement);
router.put('/requirements/:id/status', authenticateToken, requireAdmin, reqController.updateStatus);
router.put('/requirements/:id/lock', authenticateToken, requireAdmin, reqController.lockRequirement);
router.put('/requirements/:id/unlock', authenticateToken, requireAdmin, reqController.unlockRequirement);

export default router;
