import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController {
    private analyticsService: AnalyticsService;

    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    // GET /api/analytics/occupancy-rate
    getOccupancyRateByRoomType = async (req: Request, res: Response) => {
        try {
            const occupancyData = await this.analyticsService.getOccupancyRateByRoomType();
            res.json({
                success: true,
                data: occupancyData,
                message: 'Occupancy rate data retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving occupancy rate data',
                error: (error as Error).message
            });
        }
    };

    // GET /api/analytics/revenue-summary
    getRevenueSummaryByMonth = async (req: Request, res: Response) => {
        try {
            const revenueData = await this.analyticsService.getRevenueSummaryByMonth();
            res.json({
                success: true,
                data: revenueData,
                message: 'Revenue summary data retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving revenue summary data',
                error: (error as Error).message
            });
        }
    };

    // GET /api/analytics/tenant-statistics
    getTenantStatistics = async (req: Request, res: Response) => {
        try {
            const tenantStats = await this.analyticsService.getTenantStatistics();
            res.json({
                success: true,
                data: tenantStats,
                message: 'Tenant statistics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenant statistics',
                error: (error as Error).message
            });
        }
    };

    // GET /api/analytics/room-statistics
    getRoomStatistics = async (req: Request, res: Response) => {
        try {
            const roomStats = await this.analyticsService.getRoomStatistics();
            res.json({
                success: true,
                data: roomStats,
                message: 'Room statistics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving room statistics',
                error: (error as Error).message
            });
        }
    };

    // GET /api/analytics/payment-analytics
    getPaymentAnalytics = async (req: Request, res: Response) => {
        try {
            const paymentAnalytics = await this.analyticsService.getPaymentAnalytics();
            res.json({
                success: true,
                data: paymentAnalytics,
                message: 'Payment analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving payment analytics',
                error: (error as Error).message
            });
        }
    };

    // GET /api/analytics/tenants-pending-payments
    getTenantsWithPendingPayments = async (req: Request, res: Response) => {
        try {
            const tenants = await this.analyticsService.getTenantsWithPendingPayments();
            res.json({
                success: true,
                data: tenants,
                message: 'Tenants with pending payments retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving tenants with pending payments',
                error: (error as Error).message
            });
        }
    };

    // GET /api/analytics/most-expensive-room
    getMostExpensiveRoom = async (req: Request, res: Response) => {
        try {
            const room = await this.analyticsService.getMostExpensiveRoom();
            res.json({
                success: true,
                data: room,
                message: 'Most expensive room retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving most expensive room',
                error: (error as Error).message
            });
        }
    };

    // GET /api/analytics/empty-rooms
    getEmptyRooms = async (req: Request, res: Response) => {
        try {
            const rooms = await this.analyticsService.getEmptyRooms();
            res.json({
                success: true,
                data: rooms,
                message: 'Empty rooms retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving empty rooms',
                error: (error as Error).message
            });
        }
    };

    // GET /api/analytics/comprehensive
    getComprehensiveAnalytics = async (req: Request, res: Response) => {
        try {
            const analytics = await this.analyticsService.getComprehensiveAnalytics();
            res.json({
                success: true,
                data: analytics,
                message: 'Comprehensive analytics retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving comprehensive analytics',
                error: (error as Error).message
            });
        }
    };
}
