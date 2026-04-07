import { Router } from 'express';
import { RoomController } from './room.controller';
import { validateId } from '../../utils/validation';
import { validateRoomRequest } from './room.validation';

const router = Router();
const roomController = new RoomController();

// GET /api/rooms - Get all rooms
router.get('/', roomController.getAllRooms);

// GET /api/rooms/available - Get available rooms
router.get('/available', roomController.getAvailableRooms);

// GET /api/rooms/:id - Get room by ID
router.get('/:id', validateId, roomController.getRoomById);

// POST /api/rooms - Create new room
router.post('/', validateRoomRequest, roomController.createRoom);

// PUT /api/rooms/:id - Update room
router.put('/:id', validateId, validateRoomRequest, roomController.updateRoom);

// DELETE /api/rooms/:id - Delete room
router.delete('/:id', validateId, roomController.deleteRoom);

export default router;
