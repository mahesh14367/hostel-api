import { Router } from 'express';
import { BedController } from './bed.controller';
import { validateId } from '../../utils/validation';
import { validateBedRequest } from './bed.validation';

const router = Router();
const bedController = new BedController();



// GET /api/beds - Get all beds
router.get('/', bedController.getAllBeds);

// GET /api/beds/available - Get available beds
router.get('/available', bedController.getAvailableBeds);

// GET /api/beds/room/:roomId - Get beds by room
router.get('/room/:roomId', bedController.getBedsByRoom);

// GET /api/beds/room/:roomId/available - Get available beds by room
router.get('/room/:roomId/available', bedController.getAvailableBedsByRoom);

// GET /api/beds/:id - Get bed by ID
router.get('/:id', validateId, bedController.getBedById);

// POST /api/beds - Create new bed
router.post('/', validateBedRequest, bedController.createBed);

// PUT /api/beds/:id - Update bed
router.put('/:id', validateId, validateBedRequest, bedController.updateBed);

// DELETE /api/beds/:id - Delete bed
router.delete('/:id', validateId, bedController.deleteBed);

export default router;
