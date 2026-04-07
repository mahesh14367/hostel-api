import { Router } from 'express';
import { ComplaintController } from './complaint.controller';
import { validateId } from '../../utils/validation';
import { validateComplaintRequest } from './complaint.validation';

const router = Router();
const complaintController = new ComplaintController();

// GET /api/complaints - Get all complaints
router.get('/', complaintController.getAllComplaints);

// GET /api/complaints/pending - Get pending complaints
router.get('/pending', complaintController.getPendingComplaints);

// GET /api/complaints/resolved - Get resolved complaints
router.get('/resolved', complaintController.getResolvedComplaints);

// GET /api/complaints/status/:status - Get complaints by status
router.get('/status/:status', complaintController.getComplaintsByStatus);

// GET /api/complaints/date-range - Get complaints by date range
router.get('/date-range', complaintController.getComplaintsByDateRange);

// GET /api/complaints/tenant/:tenantId - Get complaints by tenant
router.get('/tenant/:tenantId', complaintController.getComplaintsByTenant);

// GET /api/complaints/:id - Get complaint by ID
router.get('/:id', validateId, complaintController.getComplaintById);

// POST /api/complaints - Create new complaint
router.post('/', validateComplaintRequest, complaintController.createComplaint);

// PUT /api/complaints/:id - Update complaint
router.put('/:id', validateId, validateComplaintRequest, complaintController.updateComplaint);

// PUT /api/complaints/:id/status - Update complaint status
router.put('/:id/status', validateId, complaintController.updateComplaintStatus);

// DELETE /api/complaints/:id - Delete complaint
router.delete('/:id', validateId, complaintController.deleteComplaint);

export default router;
