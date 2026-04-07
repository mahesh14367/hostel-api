import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';

const router = Router();
const analyticsController = new AnalyticsController();

// GET /api/analytics/occupancy-rate - Get occupancy rate by room type
router.get('/occupancy-rate', analyticsController.getOccupancyRateByRoomType);

// GET /api/analytics/revenue-summary - Get revenue summary by month
router.get('/revenue-summary', analyticsController.getRevenueSummaryByMonth);

// GET /api/analytics/tenant-statistics - Get tenant statistics
router.get('/tenant-statistics', analyticsController.getTenantStatistics);

// GET /api/analytics/room-statistics - Get room statistics
router.get('/room-statistics', analyticsController.getRoomStatistics);

// GET /api/analytics/payment-analytics - Get payment analytics
router.get('/payment-analytics', analyticsController.getPaymentAnalytics);

// GET /api/analytics/tenants-pending-payments - Get tenants with pending payments
router.get('/tenants-pending-payments', analyticsController.getTenantsWithPendingPayments);

// GET /api/analytics/most-expensive-room - Get most expensive room
router.get('/most-expensive-room', analyticsController.getMostExpensiveRoom);

// GET /api/analytics/empty-rooms - Get empty rooms
router.get('/empty-rooms', analyticsController.getEmptyRooms);

// GET /api/analytics/comprehensive - Get comprehensive analytics
router.get('/comprehensive', analyticsController.getComprehensiveAnalytics);

export default router;
