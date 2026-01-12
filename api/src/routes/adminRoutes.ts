import { Router } from 'express';
import * as reqController from '../controllers/requirementsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/requirements', authenticateToken, requireAdmin, reqController.getAllRequirements);
router.put('/requirements/:id/status', authenticateToken, requireAdmin, reqController.updateStatus);

export default router;
