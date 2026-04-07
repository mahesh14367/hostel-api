import { Request, Response } from 'express';
import { ComplaintService, Complaint } from './complaint.service';

export class ComplaintController {
    private complaintService: ComplaintService;

    constructor() {
        this.complaintService = new ComplaintService();
    }

    getAllComplaints = async (req: Request, res: Response) => {
        try {
            const complaints = await this.complaintService.getAllComplaints();
            res.json({
                success: true,
                data: complaints,
                message: 'Complaints retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving complaints',
                error: (error as Error).message
            });
        }
    };

    getComplaintById = async (req: Request, res: Response) => {
        try {
            const complaintId = parseInt(req.params.id as string);
            if (isNaN(complaintId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid complaint ID'
                });
            }

            const complaint = await this.complaintService.getComplaintById(complaintId);
            if (!complaint) {
                return res.status(404).json({
                    success: false,
                    message: 'Complaint not found'
                });
            }

            res.json({
                success: true,
                data: complaint,
                message: 'Complaint retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving complaint',
                error: (error as Error).message
            });
        }
    };

    createComplaint = async (req: Request, res: Response) => {
        try {
            const { tenant_id, description, status } = req.body;

            // Validation
            if (!tenant_id || !description) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: tenant_id, description'
                });
            }

            if (!description.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Description cannot be empty'
                });
            }

            const complaintData: Omit<Complaint, 'complaint_id' | 'created_at'> = {
                tenant_id: parseInt(tenant_id),
                description: description.trim(),
                status: status || 'pending'
            };

            const newComplaint = await this.complaintService.createComplaint(complaintData);
            res.status(201).json({
                success: true,
                data: newComplaint,
                message: 'Complaint created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating complaint',
                error: (error as Error).message
            });
        }
    };

    updateComplaint = async (req: Request, res: Response) => {
        try {
            const complaintId = parseInt(req.params.id as string);
            if (isNaN(complaintId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid complaint ID'
                });
            }

            const updateData = req.body;
            if (updateData.tenant_id !== undefined) {
                updateData.tenant_id = parseInt(updateData.tenant_id);
            }
            if (updateData.description !== undefined) {
                updateData.description = updateData.description.trim();
                if (!updateData.description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Description cannot be empty'
                    });
                }
            }

            const updatedComplaint = await this.complaintService.updateComplaint(complaintId, updateData);
            if (!updatedComplaint) {
                return res.status(404).json({
                    success: false,
                    message: 'Complaint not found'
                });
            }

            res.json({
                success: true,
                data: updatedComplaint,
                message: 'Complaint updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating complaint',
                error: (error as Error).message
            });
        }
    };

    deleteComplaint = async (req: Request, res: Response) => {
        try {
            const complaintId = parseInt(req.params.id as string);
            if (isNaN(complaintId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid complaint ID'
                });
            }

            const deleted = await this.complaintService.deleteComplaint(complaintId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Complaint not found'
                });
            }

            res.json({
                success: true,
                message: 'Complaint deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting complaint',
                error: (error as Error).message
            });
        }
    };

    getComplaintsByTenant = async (req: Request, res: Response) => {
        try {
            const tenantId = parseInt(req.params.tenantId as string);
            if (isNaN(tenantId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tenant ID'
                });
            }

            const complaints = await this.complaintService.getComplaintsByTenant(tenantId);
            res.json({
                success: true,
                data: complaints,
                message: 'Complaints retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving complaints',
                error: (error as Error).message
            });
        }
    };

    getComplaintsByStatus = async (req: Request, res: Response) => {
        try {
            const status = req.params.status as string;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const validStatuses = ['pending', 'in-progress', 'resolved'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be one of: pending, in-progress, resolved'
                });
            }

            const complaints = await this.complaintService.getComplaintsByStatus(status);
            res.json({
                success: true,
                data: complaints,
                message: 'Complaints retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving complaints',
                error: (error as Error).message
            });
        }
    };

    getComplaintsByDateRange = async (req: Request, res: Response) => {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date and end date are required'
                });
            }

            const complaints = await this.complaintService.getComplaintsByDateRange(
                new Date(startDate as string),
                new Date(endDate as string)
            );
            
            res.json({
                success: true,
                data: complaints,
                message: 'Complaints retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving complaints',
                error: (error as Error).message
            });
        }
    };

    getPendingComplaints = async (req: Request, res: Response) => {
        try {
            const complaints = await this.complaintService.getPendingComplaints();
            res.json({
                success: true,
                data: complaints,
                message: 'Pending complaints retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving pending complaints',
                error: (error as Error).message
            });
        }
    };

    getResolvedComplaints = async (req: Request, res: Response) => {
        try {
            const complaints = await this.complaintService.getResolvedComplaints();
            res.json({
                success: true,
                data: complaints,
                message: 'Resolved complaints retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving resolved complaints',
                error: (error as Error).message
            });
        }
    };

    updateComplaintStatus = async (req: Request, res: Response) => {
        try {
            const complaintId = parseInt(req.params.id as string);
            const { status } = req.body;
            
            if (isNaN(complaintId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid complaint ID'
                });
            }

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const validStatuses = ['pending', 'in-progress', 'resolved'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be one of: pending, in-progress, resolved'
                });
            }

            const updatedComplaint = await this.complaintService.updateComplaintStatus(complaintId, status);
            if (!updatedComplaint) {
                return res.status(404).json({
                    success: false,
                    message: 'Complaint not found'
                });
            }

            res.json({
                success: true,
                data: updatedComplaint,
                message: 'Complaint status updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating complaint status',
                error: (error as Error).message
            });
        }
    };
}
