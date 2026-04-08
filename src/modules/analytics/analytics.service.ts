import pool from '../../config/database';

export interface OccupancyRate {
    room_type: string;
    total_beds: number;
    occupied_beds: number;
    available_beds: number;
    occupancy_rate: number;
}

export interface RevenueSummary {
    month: string;
    payment_count: number;
    total_amount: number;
    pending_amount: number;
    completed_amount: number;
}

export interface TenantStatistics {
    total_tenants: number;
    active_tenants: number;
    new_this_month: number;
    tenants_with_pending_payments: number;
}

export interface RoomStatistics {
    room_id: number;
    room_type: string;
    rent: number;
    total_beds: number;
    occupied_beds: number;
    available_beds: number;
    occupancy_rate: number;
    monthly_revenue: number;
}

export interface PaymentAnalytics {
    total_revenue: number;
    average_payment: number;
    pending_payments: number;
    completed_payments: number;
    payments_this_month: number;
}

export class AnalyticsService {
    // Aggregate function with GROUP BY - Occupancy rate by room type
    async getOccupancyRateByRoomType(): Promise<OccupancyRate[]> {
        const [rows] = await pool.execute(`
            SELECT 
                r.room_type,
                COUNT(b.bed_id) as total_beds,
                COUNT(t.tenant_id) as occupied_beds,
                (COUNT(b.bed_id) - COUNT(t.tenant_id)) as available_beds,
                ROUND((COUNT(t.tenant_id) * 100.0 / COUNT(b.bed_id)), 2) as occupancy_rate
            FROM ROOM r 
            JOIN BED b ON r.room_id = b.room_id 
            LEFT JOIN TENANT t ON b.bed_id = t.bed_id 
            GROUP BY r.room_type
            ORDER BY occupancy_rate DESC
        `);
        return rows as OccupancyRate[];
    }

    // Aggregate functions with GROUP BY - Revenue summary by month
    async getRevenueSummaryByMonth(): Promise<RevenueSummary[]> {
        const [rows] = await pool.execute(`
            SELECT 
                DATE_FORMAT(payment_date, '%Y-%m') as month,
                COUNT(*) as payment_count,
                SUM(amount) as total_amount,
                SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
                SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as completed_amount
            FROM PAYMENT 
            WHERE payment_date >= '2024-01-01'
            GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
            HAVING total_amount > 0
            ORDER BY month DESC
        `);
        return rows as RevenueSummary[];
    }

    // Aggregate functions - Overall tenant statistics
    async getTenantStatistics(): Promise<TenantStatistics> {
        const [rows] = await pool.execute(`
            SELECT 
                COUNT(*) as total_tenants,
                COUNT(CASE WHEN t.tenant_id IS NOT NULL THEN 1 END) as active_tenants,
                COUNT(CASE WHEN DATE(t.join_date) >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') THEN 1 END) as new_this_month,
                COUNT(DISTINCT CASE WHEN p.status = 'pending' THEN t.tenant_id END) as tenants_with_pending_payments
            FROM TENANT t
            LEFT JOIN PAYMENT p ON t.tenant_id = p.tenant_id
        `);
        return (rows as TenantStatistics[])[0];
    }

    // Complex query with subqueries and joins - Room statistics
    async getRoomStatistics(): Promise<RoomStatistics[]> {
        const [rows] = await pool.execute(`
            SELECT 
                r.room_id,
                r.room_type,
                r.rent,
                (SELECT COUNT(*) FROM BED WHERE room_id = r.room_id) as total_beds,
                (SELECT COUNT(*) FROM BED b JOIN TENANT t ON b.bed_id = t.bed_id WHERE b.room_id = r.room_id) as occupied_beds,
                (SELECT COUNT(*) FROM BED WHERE room_id = r.room_id AND status = 'available') as available_beds,
                ROUND(
                    ((SELECT COUNT(*) FROM BED b JOIN TENANT t ON b.bed_id = t.bed_id WHERE b.room_id = r.room_id) * 100.0 / 
                     (SELECT COUNT(*) FROM BED WHERE room_id = r.room_id)), 2
                ) as occupancy_rate,
                COALESCE(
                    (SELECT SUM(amount) FROM PAYMENT p 
                     JOIN TENANT t ON p.tenant_id = t.tenant_id 
                     JOIN BED b ON t.bed_id = b.bed_id 
                     WHERE b.room_id = r.room_id 
                     AND p.status = 'completed'
                     AND DATE_FORMAT(p.payment_date, '%Y-%m') = DATE_FORMAT(CURRENT_DATE, '%Y-%m')), 0
                ) as monthly_revenue
            FROM ROOM r
            ORDER BY occupancy_rate DESC
        `);
        return rows as RoomStatistics[];
    }

    // Aggregate functions - Payment analytics
    async getPaymentAnalytics(): Promise<PaymentAnalytics> {
        const [rows] = await pool.execute(`
            SELECT 
                COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_revenue,
                COALESCE(AVG(CASE WHEN status = 'completed' THEN amount END), 0) as average_payment,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
                COUNT(CASE WHEN DATE_FORMAT(payment_date, '%Y-%m') = DATE_FORMAT(CURRENT_DATE, '%Y-%m') THEN 1 END) as payments_this_month
            FROM PAYMENT
        `);
        return (rows as PaymentAnalytics[])[0];
    }

    // Multi-row subquery - Tenants with pending payments
    async getTenantsWithPendingPayments(): Promise<any[]> {
        const [rows] = await pool.execute(`
            SELECT t.*, b.bed_number, r.room_type, 
                   SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END) as pending_amount
            FROM TENANT t
            JOIN BED b ON t.bed_id = b.bed_id
            JOIN ROOM r ON b.room_id = r.room_id
            WHERE t.tenant_id IN (
                SELECT DISTINCT tenant_id FROM PAYMENT 
                WHERE status = 'pending'
            )
            GROUP BY t.tenant_id
            ORDER BY pending_amount DESC
        `);
        return rows as any[];
    }

    // Single-row subquery - Find most expensive room
    async getMostExpensiveRoom(): Promise<any> {
        const [rows] = await pool.execute(`
            SELECT r.*, 
                   (SELECT COUNT(*) FROM BED WHERE room_id = r.room_id) as total_beds,
                   (SELECT COUNT(*) FROM BED b JOIN TENANT t ON b.bed_id = t.bed_id WHERE b.room_id = r.room_id) as occupied_beds
            FROM ROOM r 
            WHERE r.rent = (SELECT MAX(rent) FROM ROOM)
        `);
        const result = rows as any[];
        return result.length > 0 ? result[0] : null;
    }

    // LEFT JOIN for rooms with no tenants
    async getEmptyRooms(): Promise<any[]> {
        const [rows] = await pool.execute(`
            SELECT r.*, COUNT(b.bed_id) as total_beds, 
                   COUNT(t.tenant_id) as tenant_count
            FROM ROOM r 
            LEFT JOIN BED b ON r.room_id = b.room_id 
            LEFT JOIN TENANT t ON b.bed_id = t.bed_id 
            GROUP BY r.room_id, r.room_type, r.rent, r.status
            HAVING tenant_count = 0
            ORDER BY r.rent DESC
        `);
        return rows as any[];
    }

    // Complex analytics with multiple joins and aggregations
    async getComprehensiveAnalytics(): Promise<any> {
        const [rows] = await pool.execute(`
            SELECT 
                -- Room Analytics
                (SELECT COUNT(*) FROM ROOM) as total_rooms,
                (SELECT COUNT(*) FROM ROOM WHERE status = 'available') as available_rooms,
                
                -- Bed Analytics  
                (SELECT COUNT(*) FROM BED) as total_beds,
                (SELECT COUNT(*) FROM BED WHERE status = 'occupied') as occupied_beds,
                (SELECT COUNT(*) FROM BED WHERE status = 'available') as available_beds,
                
                -- Tenant Analytics
                (SELECT COUNT(*) FROM TENANT) as total_tenants,
                (SELECT COUNT(*) FROM TENANT WHERE DATE(join_date) >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')) as new_tenants_this_month,
                
                -- Payment Analytics
                (SELECT COALESCE(SUM(amount), 0) FROM PAYMENT WHERE status = 'completed') as total_revenue,
                (SELECT COALESCE(SUM(amount), 0) FROM PAYMENT WHERE status = 'pending') as pending_revenue,
                (SELECT COUNT(*) FROM PAYMENT WHERE DATE_FORMAT(payment_date, '%Y-%m') = DATE_FORMAT(CURRENT_DATE, '%Y-%m')) as payments_this_month,
                
                -- Complaint Analytics
                (SELECT COUNT(*) FROM COMPLAINT) as total_complaints,
                (SELECT COUNT(*) FROM COMPLAINT WHERE status = 'pending') as pending_complaints,
                (SELECT COUNT(*) FROM COMPLAINT WHERE status = 'resolved') as resolved_complaints,
                
                -- Occupancy Rate
                ROUND(((SELECT COUNT(*) FROM BED WHERE status = 'occupied') * 100.0 / (SELECT COUNT(*) FROM BED)), 2) as overall_occupancy_rate
        `);
        return (rows as any[])[0];
    }
}
