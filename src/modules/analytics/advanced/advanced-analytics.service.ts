import pool from '../../../config/database';

export interface ViewTenantDetails {
    tenant_id: number;
    name: string;
    phone: string;
    aadhaar: string;
    join_date: Date;
    bed_id: number;
    bed_number: number;
    bed_status: string;
    room_id: number;
    room_type: string;
    rent: number;
    room_status: string;
}

export interface ViewPaymentSummary {
    tenant_id: number;
    name: string;
    phone: string;
    total_payments: number;
    total_paid: number;
    pending_amount: number;
    last_payment_date: Date;
    average_payment: number;
}

export interface ViewRoomOccupancyAnalytics {
    room_id: number;
    room_type: string;
    rent: number;
    room_status: string;
    total_beds: number;
    occupied_beds: number;
    available_beds: number;
    occupancy_rate: number;
    monthly_revenue: number;
}

export interface ViewComplaintAnalytics {
    complaint_id: number;
    description: string;
    complaint_status: string;
    created_at: Date;
    tenant_id: number;
    tenant_name: string;
    tenant_phone: string;
    bed_number: number;
    room_type: string;
    days_open: number;
}

export interface ViewFinancialDashboard {
    month: string;
    total_transactions: number;
    revenue: number;
    pending: number;
    completed_payments: number;
    pending_payments: number;
    average_payment_amount: number;
}

export interface RentProcessingResult {
    tenant_id: number;
    bed_id: number;
    rent_amount: number;
    payment_status: string;
    message: string;
}

export interface OccupancyReport {
    room_id: number;
    room_type: string;
    rent: number;
    total_beds: number;
    occupied_beds: number;
    available_beds: number;
    occupancy_rate: number;
    occupancy_category: string;
}

export interface PaymentUpdateResult {
    payments_updated: number;
    message: string;
}

export interface RoomStatusUpdateResult {
    room_id: number;
    old_status: string;
    new_status: string;
    occupancy_rate: number;
    update_message: string;
}

export class AdvancedSQLService {
    // Phase 2: Using Views for commonly used complex queries
    
    // View 1: Tenant Details - Complex JOIN simplified
    async getTenantDetailsView(): Promise<ViewTenantDetails[]> {
        const [rows] = await pool.execute('SELECT * FROM tenant_details ORDER BY join_date DESC');
        return rows as ViewTenantDetails[];
    }

    async getTenantDetailsViewById(tenantId: number): Promise<ViewTenantDetails | null> {
        const [rows] = await pool.execute('SELECT * FROM tenant_details WHERE tenant_id = ?', [tenantId]);
        const result = rows as ViewTenantDetails[];
        return result.length > 0 ? result[0] : null;
    }

    // View 2: Payment Summary - Complex aggregation simplified
    async getPaymentSummaryView(): Promise<ViewPaymentSummary[]> {
        const [rows] = await pool.execute('SELECT * FROM payment_summary ORDER BY total_paid DESC');
        return rows as ViewPaymentSummary[];
    }

    async getPaymentSummaryViewById(tenantId: number): Promise<ViewPaymentSummary | null> {
        const [rows] = await pool.execute('SELECT * FROM payment_summary WHERE tenant_id = ?', [tenantId]);
        const result = rows as ViewPaymentSummary[];
        return result.length > 0 ? result[0] : null;
    }

    // View 3: Room Occupancy Analytics - Pre-computed complex metrics
    async getRoomOccupancyAnalyticsView(): Promise<ViewRoomOccupancyAnalytics[]> {
        const [rows] = await pool.execute('SELECT * FROM room_occupancy_analytics');
        return rows as ViewRoomOccupancyAnalytics[];
    }

    // View 4: Complaint Analytics - Complex JOIN with calculations
    async getComplaintAnalyticsView(): Promise<ViewComplaintAnalytics[]> {
        const [rows] = await pool.execute('SELECT * FROM complaint_analytics ORDER BY created_at DESC');
        return rows as ViewComplaintAnalytics[];
    }

    // View 5: Financial Dashboard - Complex financial aggregations
    async getFinancialDashboardView(): Promise<ViewFinancialDashboard[]> {
        const [rows] = await pool.execute('SELECT * FROM financial_dashboard ORDER BY month DESC LIMIT 24');
        return rows as ViewFinancialDashboard[];
    }

    // Phase 2: Advanced Subqueries for complex filtering

    // Subquery: Find tenants with above-average rent payments
    async getTenantsWithAboveAverageRent(): Promise<any[]> {
        const [rows] = await pool.execute(`
            SELECT td.* 
            FROM tenant_details td
            WHERE td.rent > (
                SELECT AVG(rent) FROM ROOM
            )
            ORDER BY td.rent DESC
        `);
        return rows as any[];
    }

    // Subquery: Find rooms with occupancy rate below average
    async getRoomsBelowAverageOccupancy(): Promise<any[]> {
        const [rows] = await pool.execute(`
            SELECT roa.*
            FROM room_occupancy_analytics roa
            WHERE roa.occupancy_rate < (
                SELECT AVG(occupancy_rate) FROM room_occupancy_analytics
            )
            ORDER BY roa.occupancy_rate ASC
        `);
        return rows as any[];
    }

    // Subquery: Find long-pending complaints (correlated subquery)
    async getLongPendingComplaints(daysThreshold: number = 7): Promise<any[]> {
        const [rows] = await pool.execute(`
            SELECT ca.*, 
                   (SELECT COUNT(*) FROM COMPLAINT c2 
                    WHERE c2.tenant_id = ca.tenant_id 
                    AND c2.status = 'pending') as total_pending_complaints
            FROM complaint_analytics ca
            WHERE ca.complaint_status = 'pending' 
            AND ca.days_open > ?
            ORDER BY ca.days_open DESC
        `, [daysThreshold]);
        return rows as any[];
    }

    // Subquery: Find tenants with payment issues (multi-row subquery)
    async getTenantsWithPaymentIssues(): Promise<any[]> {
        const [rows] = await pool.execute(`
            SELECT td.*, ps.pending_amount, ps.total_paid
            FROM tenant_details td
            JOIN payment_summary ps ON td.tenant_id = ps.tenant_id
            WHERE ps.tenant_id IN (
                SELECT DISTINCT tenant_id 
                FROM PAYMENT 
                WHERE status = 'pending' 
                AND payment_date < DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
            )
            ORDER BY ps.pending_amount DESC
        `);
        return rows as any[];
    }

    // Phase 3: Stored Procedures for complex operations

    // Procedure 1: Process monthly rent collection
    async processMonthlyRent(): Promise<RentProcessingResult[]> {
        const [rows] = await pool.execute('CALL sp_process_monthly_rent()');
        return rows as RentProcessingResult[];
    }

    // Procedure 2: Generate occupancy report
    async generateOccupancyReport(reportDate?: Date): Promise<OccupancyReport[]> {
        const dateToUse = reportDate || new Date();
        const [rows] = await pool.execute('CALL sp_generate_occupancy_report(?)', [dateToUse]);
        return rows as OccupancyReport[];
    }

    // Procedure 3: Update tenant payment status
    async updateTenantPaymentStatus(tenantId: number, newStatus: string): Promise<PaymentUpdateResult> {
        const [rows] = await pool.execute('CALL sp_update_tenant_payment_status(?, ?)', [tenantId, newStatus]);
        const result = rows as PaymentUpdateResult[];
        return result.length > 0 ? result[0] : { payments_updated: 0, message: 'No result returned' };
    }

    // Phase 3: Cursor operations for batch processing

    // Cursor: Batch update room status based on occupancy
    async batchUpdateRoomStatus(): Promise<RoomStatusUpdateResult[]> {
        const [rows] = await pool.execute('CALL sp_batch_update_room_status()');
        return rows as RoomStatusUpdateResult[];
    }

    // Advanced cursor operation: Process pending payments in batches
    async processPendingPaymentsBatch(batchSize: number = 50): Promise<any[]> {
        const [rows] = await pool.execute(`
            -- Simulate cursor-like batch processing with LIMIT
            SELECT p.*, t.name as tenant_name, t.phone as tenant_phone
            FROM PAYMENT p
            JOIN TENANT t ON p.tenant_id = t.tenant_id
            WHERE p.status = 'pending'
            AND p.payment_date < DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
            ORDER BY p.payment_date ASC
            LIMIT ?
        `, [batchSize]);
        return rows as any[];
    }

    // Complex operation: Find and flag problematic accounts
    async flagProblematicAccounts(): Promise<any[]> {
        const [rows] = await pool.execute(`
            SELECT 
                td.*,
                ps.pending_amount,
                ps.total_payments,
                ca.pending_complaints,
                CASE 
                    WHEN ps.pending_amount > 10000 THEN 'High Debt'
                    WHEN ca.pending_complaints > 3 THEN 'Frequent Complainer'
                    WHEN DATEDIFF(CURRENT_DATE, td.join_date) < 30 AND ps.pending_amount > 0 THEN 'New Tenant with Issues'
                    ELSE 'Monitor'
                END as risk_category
            FROM tenant_details td
            LEFT JOIN payment_summary ps ON td.tenant_id = ps.tenant_id
            LEFT JOIN (
                SELECT tenant_id, COUNT(*) as pending_complaints
                FROM COMPLAINT
                WHERE status = 'pending'
                GROUP BY tenant_id
            ) ca ON td.tenant_id = ca.tenant_id
            WHERE ps.pending_amount > 0 OR ca.pending_complaints > 0
            ORDER BY ps.pending_amount DESC, ca.pending_complaints DESC
        `);
        return rows as any[];
    }

    // Advanced analytics: Revenue projection using subqueries
    async getRevenueProjection(months: number = 6): Promise<any[]> {
        const [rows] = await pool.execute(`
            SELECT 
                DATE_FORMAT(DATE_ADD(CURRENT_DATE, INTERVAL seq.month MONTH), '%Y-%m') as projected_month,
                (
                    SELECT SUM(r.rent * COUNT(t.tenant_id)) 
                    FROM ROOM r
                    JOIN BED b ON r.room_id = b.room_id
                    JOIN TENANT t ON b.bed_id = t.bed_id
                    WHERE b.status = 'occupied'
                ) * 0.95 as projected_revenue,
                (
                    SELECT AVG(revenue) 
                    FROM financial_dashboard 
                    WHERE month >= DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH), '%Y-%m')
                ) as average_revenue,
                (
                    SELECT MAX(revenue) 
                    FROM financial_dashboard 
                    WHERE month >= DATE_FORMAT(DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH), '%Y-%m')
                ) as best_revenue
            FROM (
                SELECT 0 as month UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
            ) seq
            WHERE seq.month < ?
        `, [months]);
        return rows as any[];
    }

    // Complex subquery: Find optimal pricing strategy
    async getOptimalPricingStrategy(): Promise<any[]> {
        const [rows] = await pool.execute(`
            SELECT 
                roa.room_type,
                roa.rent as current_rent,
                roa.occupancy_rate,
                roa.monthly_revenue,
                (roa.rent * 0.9) as suggested_min_rent,
                (roa.rent * 1.1) as suggested_max_rent,
                CASE 
                    WHEN roa.occupancy_rate > 95 THEN 'Increase Rent'
                    WHEN roa.occupancy_rate < 60 THEN 'Decrease Rent'
                    ELSE 'Maintain Current Rent'
                END as pricing_strategy,
                (
                    SELECT AVG(rent) 
                    FROM ROOM r2 
                    WHERE r2.room_type = roa.room_type
                ) as market_average_rent
            FROM room_occupancy_analytics roa
            GROUP BY roa.room_type, roa.rent, roa.occupancy_rate, roa.monthly_revenue
            ORDER BY roa.occupancy_rate DESC
        `);
        return rows as any[];
    }
}
