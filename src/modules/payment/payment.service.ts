import pool from '../../config/database';

export interface Payment {
    payment_id: number;
    tenant_id: number;
    amount: number;
    payment_date: Date;
    payment_mode: string;
    status: string;
}

export class PaymentService {
    async getAllPayments(): Promise<Payment[]> {
        const [rows] = await pool.execute(`
            SELECT p.*, t.name as tenant_name, t.phone as tenant_phone
            FROM PAYMENT p
            JOIN TENANT t ON p.tenant_id = t.tenant_id
            ORDER BY p.payment_date DESC
        `);
        return rows as Payment[];
    }

    async getPaymentById(paymentId: number): Promise<Payment | null> {
        const [rows] = await pool.execute(`
            SELECT p.*, t.name as tenant_name, t.phone as tenant_phone
            FROM PAYMENT p
            JOIN TENANT t ON p.tenant_id = t.tenant_id
            WHERE p.payment_id = ?
        `, [paymentId]);
        const payments = rows as Payment[];
        return payments.length > 0 ? payments[0] : null;
    }

    async createPayment(payment: Omit<Payment, 'payment_id'>): Promise<Payment> {
        const [result] = await pool.execute(
            'INSERT INTO PAYMENT (tenant_id, amount, payment_date, payment_mode, status) VALUES (?, ?, ?, ?, ?)',
            [payment.tenant_id, payment.amount, payment.payment_date, payment.payment_mode, payment.status]
        );
        const insertId = (result as any).insertId;
        return { payment_id: insertId, ...payment };
    }

    async updatePayment(paymentId: number, payment: Partial<Omit<Payment, 'payment_id'>>): Promise<Payment | null> {
        const fields = [];
        const values = [];
        
        if (payment.tenant_id !== undefined) {
            fields.push('tenant_id = ?');
            values.push(payment.tenant_id);
        }
        if (payment.amount !== undefined) {
            fields.push('amount = ?');
            values.push(payment.amount);
        }
        if (payment.payment_date !== undefined) {
            fields.push('payment_date = ?');
            values.push(payment.payment_date);
        }
        if (payment.payment_mode !== undefined) {
            fields.push('payment_mode = ?');
            values.push(payment.payment_mode);
        }
        if (payment.status !== undefined) {
            fields.push('status = ?');
            values.push(payment.status);
        }
        
        if (fields.length === 0) {
            return this.getPaymentById(paymentId);
        }
        
        values.push(paymentId);
        await pool.execute(
            `UPDATE PAYMENT SET ${fields.join(', ')} WHERE payment_id = ?`,
            values
        );
        
        return this.getPaymentById(paymentId);
    }

    async deletePayment(paymentId: number): Promise<boolean> {
        const [result] = await pool.execute('DELETE FROM PAYMENT WHERE payment_id = ?', [paymentId]);
        return (result as any).affectedRows > 0;
    }

    async getPaymentsByTenant(tenantId: number): Promise<Payment[]> {
        const [rows] = await pool.execute(`
            SELECT p.*, t.name as tenant_name, t.phone as tenant_phone
            FROM PAYMENT p
            JOIN TENANT t ON p.tenant_id = t.tenant_id
            WHERE p.tenant_id = ?
            ORDER BY p.payment_date DESC
        `, [tenantId]);
        return rows as Payment[];
    }

    async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
        const [rows] = await pool.execute(`
            SELECT p.*, t.name as tenant_name, t.phone as tenant_phone
            FROM PAYMENT p
            JOIN TENANT t ON p.tenant_id = t.tenant_id
            WHERE p.payment_date BETWEEN ? AND ?
            ORDER BY p.payment_date DESC
        `, [startDate, endDate]);
        return rows as Payment[];
    }

    async getPaymentsByStatus(status: string): Promise<Payment[]> {
        const [rows] = await pool.execute(`
            SELECT p.*, t.name as tenant_name, t.phone as tenant_phone
            FROM PAYMENT p
            JOIN TENANT t ON p.tenant_id = t.tenant_id
            WHERE p.status = ?
            ORDER BY p.payment_date DESC
        `, [status]);
        return rows as Payment[];
    }

    async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
        let query = 'SELECT SUM(amount) as total FROM PAYMENT WHERE status = "completed"';
        const params: any[] = [];
        
        if (startDate && endDate) {
            query += ' AND payment_date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }
        
        const [rows] = await pool.execute(query, params);
        const result = rows as any[];
        return result[0].total || 0;
    }

    async getPendingPayments(): Promise<Payment[]> {
        const [rows] = await pool.execute(`
            SELECT p.*, t.name as tenant_name, t.phone as tenant_phone
            FROM PAYMENT p
            JOIN TENANT t ON p.tenant_id = t.tenant_id
            WHERE p.status = "pending"
            ORDER BY p.payment_date ASC
        `);
        return rows as Payment[];
    }
}
