import { Request, Response } from 'express';
import { RoomService, Room } from './room.service';

export class RoomController {
    private roomService: RoomService;

    constructor() {
        this.roomService = new RoomService();
    }

    getAllRooms = async (req: Request, res: Response) => {
        try {
            const rooms = await this.roomService.getAllRooms();
            res.json({
                success: true,
                data: rooms,
                message: 'Rooms retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving rooms',
                error: (error as Error).message
            });
        }
    };

    getRoomById = async (req: Request, res: Response) => {
        try {
            const roomId = parseInt(req.params.id as string);
            if (isNaN(roomId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid room ID'
                });
            }

            const room = await this.roomService.getRoomById(roomId);
            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: 'Room not found'
                });
            }

            res.json({
                success: true,
                data: room,
                message: 'Room retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving room',
                error: (error as Error).message
            });
        }
    };

    createRoom = async (req: Request, res: Response) => {
        try {
            const { room_type, rent, status } = req.body;

            // Validation is handled by middleware
            const roomData: Omit<Room, 'room_id'> = {
                room_type,
                rent: parseFloat(rent),
                status
            };

            const newRoom = await this.roomService.createRoom(roomData);
            res.status(201).json({
                success: true,
                data: newRoom,
                message: 'Room created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating room',
                error: (error as Error).message
            });
        }
    };

    updateRoom = async (req: Request, res: Response) => {
        try {
            const roomId = parseInt(req.params.id as string);
            const updateData = req.body;
            if (updateData.rent !== undefined) {
                updateData.rent = parseFloat(updateData.rent);
            }

            const updatedRoom = await this.roomService.updateRoom(roomId, updateData);
            if (!updatedRoom) {
                return res.status(404).json({
                    success: false,
                    message: 'Room not found'
                });
            }

            res.json({
                success: true,
                data: updatedRoom,
                message: 'Room updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating room',
                error: (error as Error).message
            });
        }
    };

    deleteRoom = async (req: Request, res: Response) => {
        try {
            const roomId = parseInt(req.params.id as string);
            if (isNaN(roomId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid room ID'
                });
            }

            const deleted = await this.roomService.deleteRoom(roomId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Room not found'
                });
            }

            res.json({
                success: true,
                message: 'Room deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting room',
                error: (error as Error).message
            });
        }
    };

    getAvailableRooms = async (req: Request, res: Response) => {
        try {
            const rooms = await this.roomService.getAvailableRooms();
            res.json({
                success: true,
                data: rooms,
                message: 'Available rooms retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving available rooms',
                error: (error as Error).message
            });
        }
    };
}
