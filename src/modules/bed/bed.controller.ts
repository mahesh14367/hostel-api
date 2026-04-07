import { Request, Response } from 'express';
import { BedService, Bed } from './bed.service';

export class BedController {
    private bedService: BedService;

    constructor() {
        this.bedService = new BedService();
    }

    getAllBeds = async (req: Request, res: Response) => {
        try {
            const beds = await this.bedService.getAllBeds();
            res.json({
                success: true,
                data: beds,
                message: 'Beds retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving beds',
                error: (error as Error).message
            });
        }
    };

    getBedById = async (req: Request, res: Response) => {
        try {
            const bedId = parseInt(req.params.id as string);
            if (isNaN(bedId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid bed ID'
                });
            }

            const bed = await this.bedService.getBedById(bedId);
            if (!bed) {
                return res.status(404).json({
                    success: false,
                    message: 'Bed not found'
                });
            }

            res.json({
                success: true,
                data: bed,
                message: 'Bed retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving bed',
                error: (error as Error).message
            });
        }
    };

    getBedsByRoom = async (req: Request, res: Response) => {
        try {
            const roomId = parseInt(req.params.roomId as string);
            if (isNaN(roomId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid room ID'
                });
            }

            const beds = await this.bedService.getBedsByRoom(roomId);
            res.json({
                success: true,
                data: beds,
                message: 'Beds retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving beds',
                error: (error as Error).message
            });
        }
    };

    createBed = async (req: Request, res: Response) => {
        try {
            const {bed_id, room_id, bed_number, status } = req.body;

            // Validation is handled by middleware
            const bedData: Bed = {
                bed_id: parseInt(bed_id),
                room_id: parseInt(room_id),
                bed_number: parseInt(bed_number),
                status
            };

            const newBed = await this.bedService.createBed(bedData);
            res.status(201).json({
                success: true,
                data: newBed,
                message: 'Bed created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating bed',
                error: (error as Error).message
            });
        }
    };

    updateBed = async (req: Request, res: Response) => {
        try {
            const bedId = parseInt(req.params.id as string);
            if (isNaN(bedId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid bed ID'
                });
            }

            const updateData = req.body;
            if (updateData.room_id !== undefined) {
                updateData.room_id = parseInt(updateData.room_id);
            }
            if (updateData.bed_number !== undefined) {
                updateData.bed_number = parseInt(updateData.bed_number);
            }

            const updatedBed = await this.bedService.updateBed(bedId, updateData);
            if (!updatedBed) {
                return res.status(404).json({
                    success: false,
                    message: 'Bed not found'
                });
            }

            res.json({
                success: true,
                data: updatedBed,
                message: 'Bed updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating bed',
                error: (error as Error).message
            });
        }
    };

    deleteBed = async (req: Request, res: Response) => {
        try {
            const bedId = parseInt(req.params.id as string);
            if (isNaN(bedId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid bed ID'
                });
            }

            const deleted = await this.bedService.deleteBed(bedId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Bed not found'
                });
            }

            res.json({
                success: true,
                message: 'Bed deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting bed',
                error: (error as Error).message
            });
        }
    };

    getAvailableBeds = async (req: Request, res: Response) => {
        try {
            const beds = await this.bedService.getAvailableBeds();
            res.json({
                success: true,
                data: beds,
                message: 'Available beds retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving available beds',
                error: (error as Error).message
            });
        }
    };

    getAvailableBedsByRoom = async (req: Request, res: Response) => {
        try {
            const roomId = parseInt(req.params.roomId as string);
            if (isNaN(roomId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid room ID'
                });
            }

            const beds = await this.bedService.getAvailableBedsByRoom(roomId);
            res.json({
                success: true,
                data: beds,
                message: 'Available beds retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving available beds',
                error: (error as Error).message
            });
        }
    };
}
