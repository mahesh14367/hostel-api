import { Router } from 'express';
import { AdvancedAnalyticsController } from './advanced-analytics.controller';
import { validateId } from '../../../utils/validation';

const router = Router();
const advancedAnalyticsController = new AdvancedAnalyticsController();

// Phase 2: Views endpoints
// GET /api/analytics/views/tenant-details - Get all tenant details from view
router.get('/views/tenant-details', advancedAnalyticsController.getTenantDetailsView);

// GET /api/analytics/views/tenant-details/:id - Get tenant details by ID from view
router.get('/views/tenant-details/:id', validateId, advancedAnalyticsController.getTenantDetailsViewById);

// GET /api/analytics/views/payment-summary - Get payment summary from view
router.get('/views/payment-summary', advancedAnalyticsController.getPaymentSummaryView);

// GET /api/analytics/views/room-occupancy - Get room occupancy analytics from view
router.get('/views/room-occupancy', advancedAnalyticsController.getRoomOccupancyAnalyticsView);

// GET /api/analytics/views/complaint-analytics - Get complaint analytics from view
router.get('/views/complaint-analytics', advancedAnalyticsController.getComplaintAnalyticsView);

// GET /api/analytics/views/financial-dashboard - Get financial dashboard from view
router.get('/views/financial-dashboard', advancedAnalyticsController.getFinancialDashboardView);

// Phase 2: Advanced Subqueries endpoints
// GET /api/analytics/subqueries/above-average-rent - Get tenants with above-average rent
router.get('/subqueries/above-average-rent', advancedAnalyticsController.getTenantsWithAboveAverageRent);

// GET /api/analytics/subqueries/below-average-occupancy - Get rooms below average occupancy
router.get('/subqueries/below-average-occupancy', advancedAnalyticsController.getRoomsBelowAverageOccupancy);

// GET /api/analytics/subqueries/long-pending-complaints - Get long pending complaints
router.get('/subqueries/long-pending-complaints', advancedAnalyticsController.getLongPendingComplaints);

// GET /api/analytics/subqueries/payment-issues - Get tenants with payment issues
router.get('/subqueries/payment-issues', advancedAnalyticsController.getTenantsWithPaymentIssues);

// Phase 3: Stored Procedures endpoints
// POST /api/analytics/procedures/process-rent - Process monthly rent using stored procedure
router.post('/procedures/process-rent', advancedAnalyticsController.processMonthlyRent);

// GET /api/analytics/procedures/occupancy-report - Generate occupancy report using stored procedure
router.get('/procedures/occupancy-report', advancedAnalyticsController.generateOccupancyReport);

// PUT /api/analytics/procedures/update-payment-status - Update tenant payment status using stored procedure
router.put('/procedures/update-payment-status', advancedAnalyticsController.updateTenantPaymentStatus);

// Phase 3: Cursor operations endpoints
// POST /api/analytics/cursors/update-room-status - Batch update room status using cursor
router.post('/cursors/update-room-status', advancedAnalyticsController.batchUpdateRoomStatus);

// GET /api/analytics/cursors/process-payments - Process pending payments in batches
router.get('/cursors/process-payments', advancedAnalyticsController.processPendingPaymentsBatch);

// Advanced analytics endpoints
// GET /api/analytics/advanced/problematic-accounts - Flag problematic accounts
router.get('/advanced/problematic-accounts', advancedAnalyticsController.flagProblematicAccounts);

// GET /api/analytics/advanced/revenue-projection - Get revenue projection
router.get('/advanced/revenue-projection', advancedAnalyticsController.getRevenueProjection);

// GET /api/analytics/advanced/pricing-strategy - Get optimal pricing strategy
router.get('/advanced/pricing-strategy', advancedAnalyticsController.getOptimalPricingStrategy);

export default router;
