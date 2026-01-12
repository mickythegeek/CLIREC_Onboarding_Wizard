import { Router } from 'express';
import * as reqController from '../controllers/requirementsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// User routes
router.post('/', authenticateToken, reqController.createRequirement);
router.get('/', authenticateToken, reqController.getMyRequirements);
router.get('/:id', authenticateToken, reqController.getRequirement);
router.put('/:id', authenticateToken, reqController.updateRequirement);
router.delete('/:id', authenticateToken, reqController.deleteRequirement);
router.get('/download/:id', authenticateToken, reqController.downloadRequirement);

export default router;
