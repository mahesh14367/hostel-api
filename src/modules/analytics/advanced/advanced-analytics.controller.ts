import { Request, Response } from 'express';
import { AdvancedSQLService } from './advanced-analytics.service';

export class AdvancedAnalyticsController {
    private advancedAnalyticsService: AdvancedSQLService;

    constructor() {
        this.advancedAnalyticsService = new AdvancedSQLService();
    }

    // Phase 2: Views endpoints
    getTenantDetailsView = async (req: Request, res: Response) => {
        try {
            const tenantDetails = await this.advancedAnalyticsService.getTenantDetailsView();
            res.json({
                success: true,
                data: tenantDetails,
                message: 'Tenant details view retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenant details view',
                error: (error as Error).message
            });
        }
    };

    getTenantDetailsViewById = async (req: Request, res: Response) => {
        try {
            const tenantId = parseInt(req.params.id as string);
            if (isNaN(tenantId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tenant ID'
                });
            }

            const tenantDetails = await this.advancedAnalyticsService.getTenantDetailsViewById(tenantId);
            if (!tenantDetails) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found'
                });
            }

            res.json({
                success: true,
                data: tenantDetails,
                message: 'Tenant details retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenant details',
                error: (error as Error).message
            });
        }
    };

    getPaymentSummaryView = async (req: Request, res: Response) => {
        try {
            const paymentSummary = await this.advancedAnalyticsService.getPaymentSummaryView();
            res.json({
                success: true,
                data: paymentSummary,
                message: 'Payment summary view retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving payment summary view',
                error: (error as Error).message
            });
        }
    };

    getRoomOccupancyAnalyticsView = async (req: Request, res: Response) => {
        try {
            const occupancyAnalytics = await this.advancedAnalyticsService.getRoomOccupancyAnalyticsView();
            res.json({
                success: true,
                data: occupancyAnalytics,
                message: 'Room occupancy analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving room occupancy analytics',
                error: (error as Error).message
            });
        }
    };

    getComplaintAnalyticsView = async (req: Request, res: Response) => {
        try {
            const complaintAnalytics = await this.advancedAnalyticsService.getComplaintAnalyticsView();
            res.json({
                success: true,
                data: complaintAnalytics,
                message: 'Complaint analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving complaint analytics',
                error: (error as Error).message
            });
        }
    };

    getFinancialDashboardView = async (req: Request, res: Response) => {
        try {
            const financialDashboard = await this.advancedAnalyticsService.getFinancialDashboardView();
            res.json({
                success: true,
                data: financialDashboard,
                message: 'Financial dashboard retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving financial dashboard',
                error: (error as Error).message
            });
        }
    };

    // Phase 2: Advanced Subqueries endpoints
    getTenantsWithAboveAverageRent = async (req: Request, res: Response) => {
        try {
            const tenants = await this.advancedAnalyticsService.getTenantsWithAboveAverageRent();
            res.json({
                success: true,
                data: tenants,
                message: 'Tenants with above-average rent retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenants with above-average rent',
                error: (error as Error).message
            });
        }
    };

    getRoomsBelowAverageOccupancy = async (req: Request, res: Response) => {
        try {
            const rooms = await this.advancedAnalyticsService.getRoomsBelowAverageOccupancy();
            res.json({
                success: true,
                data: rooms,
                message: 'Rooms below average occupancy retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving rooms below average occupancy',
                error: (error as Error).message
            });
        }
    };

    getLongPendingComplaints = async (req: Request, res: Response) => {
        try {
            const daysThreshold = parseInt(req.query.days as string) || 7;
            const complaints = await this.advancedAnalyticsService.getLongPendingComplaints(daysThreshold);
            res.json({
                success: true,
                data: complaints,
                message: 'Long pending complaints retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving long pending complaints',
                error: (error as Error).message
            });
        }
    };

    getTenantsWithPaymentIssues = async (req: Request, res: Response) => {
        try {
            const tenants = await this.advancedAnalyticsService.getTenantsWithPaymentIssues();
            res.json({
                success: true,
                data: tenants,
                message: 'Tenants with payment issues retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenants with payment issues',
                error: (error as Error).message
            });
        }
    };

    // Phase 3: Stored Procedures endpoints
    processMonthlyRent = async (req: Request, res: Response) => {
        try {
            const results = await this.advancedAnalyticsService.processMonthlyRent();
            res.json({
                success: true,
                data: results,
                message: 'Monthly rent processed successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error processing monthly rent',
                error: (error as Error).message
            });
        }
    };

    generateOccupancyReport = async (req: Request, res: Response) => {
        try {
            const reportDate = req.query.date ? new Date(req.query.date as string) : undefined;
            const report = await this.advancedAnalyticsService.generateOccupancyReport(reportDate);
            res.json({
                success: true,
                data: report,
                message: 'Occupancy report generated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error generating occupancy report',
                error: (error as Error).message
            });
        }
    };

    updateTenantPaymentStatus = async (req: Request, res: Response) => {
        try {
            const { tenantId, newStatus } = req.body;
            
            if (!tenantId || !newStatus) {
                return res.status(400).json({
                    success: false,
                    message: 'Tenant ID and new status are required'
                });
            }

            const result = await this.advancedAnalyticsService.updateTenantPaymentStatus(tenantId, newStatus);
            res.json({
                success: true,
                data: result,
                message: 'Tenant payment status updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating tenant payment status',
                error: (error as Error).message
            });
        }
    };

    // Phase 3: Cursor operations endpoints
    batchUpdateRoomStatus = async (req: Request, res: Response) => {
        try {
            const results = await this.advancedAnalyticsService.batchUpdateRoomStatus();
            res.json({
                success: true,
                data: results,
                message: 'Room status batch updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error batch updating room status',
                error: (error as Error).message
            });
        }
    };

    processPendingPaymentsBatch = async (req: Request, res: Response) => {
        try {
            const batchSize = parseInt(req.query.batchSize as string) || 50;
            const payments = await this.advancedAnalyticsService.processPendingPaymentsBatch(batchSize);
            res.json({
                success: true,
                data: payments,
                message: 'Pending payments batch processed successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error processing pending payments batch',
                error: (error as Error).message
            });
        }
    };

    // Advanced analytics endpoints
    flagProblematicAccounts = async (req: Request, res: Response) => {
        try {
            const accounts = await this.advancedAnalyticsService.flagProblematicAccounts();
            res.json({
                success: true,
                data: accounts,
                message: 'Problematic accounts flagged successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error flagging problematic accounts',
                error: (error as Error).message
            });
        }
    };

    getRevenueProjection = async (req: Request, res: Response) => {
        try {
            const months = parseInt(req.query.months as string) || 6;
            const projection = await this.advancedAnalyticsService.getRevenueProjection(months);
            res.json({
                success: true,
                data: projection,
                message: 'Revenue projection retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving revenue projection',
                error: (error as Error).message
            });
        }
    };

    getOptimalPricingStrategy = async (req: Request, res: Response) => {
        try {
            const strategy = await this.advancedAnalyticsService.getOptimalPricingStrategy();
            res.json({
                success: true,
                data: strategy,
                message: 'Optimal pricing strategy retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving optimal pricing strategy',
                error: (error as Error).message
            });
        }
    };
}
