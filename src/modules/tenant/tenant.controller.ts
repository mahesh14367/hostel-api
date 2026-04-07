import { Request, Response } from 'express';
import { TenantService, Tenant } from './tenant.service';

export class TenantController {
    private tenantService: TenantService;

    constructor() {
        this.tenantService = new TenantService();
    }

    getAllTenants = async (req: Request, res: Response) => {
        try {
            const tenants = await this.tenantService.getAllTenants();
            res.json({
                success: true,
                data: tenants,
                message: 'Tenants retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenants',
                error: (error as Error).message
            });
        }
    };

    getTenantById = async (req: Request, res: Response) => {
        try {
            const tenantId = parseInt(req.params.id as string);
            if (isNaN(tenantId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tenant ID'
                });
            }

            const tenant = await this.tenantService.getTenantById(tenantId);
            if (!tenant) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found'
                });
            }

            res.json({
                success: true,
                data: tenant,
                message: 'Tenant retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenant',
                error: (error as Error).message
            });
        }
    };

    createTenant = async (req: Request, res: Response) => {
        try {
            const { name, phone, aadhaar, join_date, bed_id } = req.body;

            // Validation
            if (!name || !phone || !aadhaar || !join_date || !bed_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: name, phone, aadhaar, join_date, bed_id'
                });
            }

            // Validate phone number format
            if (!/^\d{10,15}$/.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid phone number format'
                });
            }

            // Validate Aadhaar number format
            if (!/^\d{12}$/.test(aadhaar)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Aadhaar number format (must be 12 digits)'
                });
            }

            const tenantData: Omit<Tenant, 'tenant_id'> = {
                name,
                phone,
                aadhaar,
                join_date: new Date(join_date),
                bed_id: parseInt(bed_id)
            };

            const newTenant = await this.tenantService.createTenant(tenantData);
            res.status(201).json({
                success: true,
                data: newTenant,
                message: 'Tenant created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating tenant',
                error: (error as Error).message
            });
        }
    };

    updateTenant = async (req: Request, res: Response) => {
        try {
            const tenantId = parseInt(req.params.id as string);
            if (isNaN(tenantId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tenant ID'
                });
            }

            const updateData = req.body;
            if (updateData.bed_id !== undefined) {
                updateData.bed_id = parseInt(updateData.bed_id);
            }
            if (updateData.join_date !== undefined) {
                updateData.join_date = new Date(updateData.join_date);
            }

            // Validate phone number if provided
            if (updateData.phone && !/^\d{10,15}$/.test(updateData.phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid phone number format'
                });
            }

            // Validate Aadhaar number if provided
            if (updateData.aadhaar && !/^\d{12}$/.test(updateData.aadhaar)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Aadhaar number format (must be 12 digits)'
                });
            }

            const updatedTenant = await this.tenantService.updateTenant(tenantId, updateData);
            if (!updatedTenant) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found'
                });
            }

            res.json({
                success: true,
                data: updatedTenant,
                message: 'Tenant updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating tenant',
                error: (error as Error).message
            });
        }
    };

    deleteTenant = async (req: Request, res: Response) => {
        try {
            const tenantId = parseInt(req.params.id as string);
            if (isNaN(tenantId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tenant ID'
                });
            }

            const deleted = await this.tenantService.deleteTenant(tenantId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found'
                });
            }

            res.json({
                success: true,
                message: 'Tenant deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting tenant',
                error: (error as Error).message
            });
        }
    };

    getTenantsByRoom = async (req: Request, res: Response) => {
        try {
            const roomId = parseInt(req.params.roomId as string);
            if (isNaN(roomId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid room ID'
                });
            }

            const tenants = await this.tenantService.getTenantsByRoom(roomId);
            res.json({
                success: true,
                data: tenants,
                message: 'Tenants retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenants',
                error: (error as Error).message
            });
        }
    };

    getTenantByPhone = async (req: Request, res: Response) => {
        try {
            const phone = req.params.phone as string;
            if (!phone) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number is required'
                });
            }

            const tenant = await this.tenantService.getTenantByPhone(phone);
            if (!tenant) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found'
                });
            }

            res.json({
                success: true,
                data: tenant,
                message: 'Tenant retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenant',
                error: (error as Error).message
            });
        }
    };

    getTenantByAadhaar = async (req: Request, res: Response) => {
        try {
            const aadhaar = req.params.aadhaar as string;
            if (!aadhaar) {
                return res.status(400).json({
                    success: false,
                    message: 'Aadhaar number is required'
                });
            }

            const tenant = await this.tenantService.getTenantByAadhaar(aadhaar);
            if (!tenant) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found'
                });
            }

            res.json({
                success: true,
                data: tenant,
                message: 'Tenant retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenant',
                error: (error as Error).message
            });
        }
    };
}
