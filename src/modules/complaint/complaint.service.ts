import pool from '../../config/database';

export interface Complaint {
    complaint_id: number;
    tenant_id: number;
    description: string;
    status: string;
    created_at: Date;
}

export class ComplaintService {
    async getAllComplaints(): Promise<Complaint[]> {
        const [rows] = await pool.execute(`
            SELECT c.*, t.name as tenant_name, t.phone as tenant_phone
            FROM COMPLAINT c
            JOIN TENANT t ON c.tenant_id = t.tenant_id
            ORDER BY c.created_at DESC
        `);
        return rows as Complaint[];
    }

    async getComplaintById(complaintId: number): Promise<Complaint | null> {
        const [rows] = await pool.execute(`
            SELECT c.*, t.name as tenant_name, t.phone as tenant_phone
            FROM COMPLAINT c
            JOIN TENANT t ON c.tenant_id = t.tenant_id
            WHERE c.complaint_id = ?
        `, [complaintId]);
        const complaints = rows as Complaint[];
        return complaints.length > 0 ? complaints[0] : null;
    }

    async createComplaint(complaint: Omit<Complaint, 'complaint_id' | 'created_at'>): Promise<Complaint> {
        const [result] = await pool.execute(
            'INSERT INTO COMPLAINT (tenant_id, description, status, created_at) VALUES (?, ?, ?, ?)',
            [complaint.tenant_id, complaint.description, complaint.status, new Date()]
        );
        const insertId = (result as any).insertId;
        return { complaint_id: insertId, ...complaint, created_at: new Date() };
    }

    async updateComplaint(complaintId: number, complaint: Partial<Omit<Complaint, 'complaint_id' | 'created_at'>>): Promise<Complaint | null> {
        const fields = [];
        const values = [];
        
        if (complaint.tenant_id !== undefined) {
            fields.push('tenant_id = ?');
            values.push(complaint.tenant_id);
        }
        if (complaint.description !== undefined) {
            fields.push('description = ?');
            values.push(complaint.description);
        }
        if (complaint.status !== undefined) {
            fields.push('status = ?');
            values.push(complaint.status);
        }
        
        if (fields.length === 0) {
            return this.getComplaintById(complaintId);
        }
        
        values.push(complaintId);
        await pool.execute(
            `UPDATE COMPLAINT SET ${fields.join(', ')} WHERE complaint_id = ?`,
            values
        );
        
        return this.getComplaintById(complaintId);
    }

    async deleteComplaint(complaintId: number): Promise<boolean> {
        const [result] = await pool.execute('DELETE FROM COMPLAINT WHERE complaint_id = ?', [complaintId]);
        return (result as any).affectedRows > 0;
    }

    async getComplaintsByTenant(tenantId: number): Promise<Complaint[]> {
        const [rows] = await pool.execute(`
            SELECT c.*, t.name as tenant_name, t.phone as tenant_phone
            FROM COMPLAINT c
            JOIN TENANT t ON c.tenant_id = t.tenant_id
            WHERE c.tenant_id = ?
            ORDER BY c.created_at DESC
        `, [tenantId]);
        return rows as Complaint[];
    }

    async getComplaintsByStatus(status: string): Promise<Complaint[]> {
        const [rows] = await pool.execute(`
            SELECT c.*, t.name as tenant_name, t.phone as tenant_phone
            FROM COMPLAINT c
            JOIN TENANT t ON c.tenant_id = t.tenant_id
            WHERE c.status = ?
            ORDER BY c.created_at DESC
        `, [status]);
        return rows as Complaint[];
    }

    async getComplaintsByDateRange(startDate: Date, endDate: Date): Promise<Complaint[]> {
        const [rows] = await pool.execute(`
            SELECT c.*, t.name as tenant_name, t.phone as tenant_phone
            FROM COMPLAINT c
            JOIN TENANT t ON c.tenant_id = t.tenant_id
            WHERE c.created_at BETWEEN ? AND ?
            ORDER BY c.created_at DESC
        `, [startDate, endDate]);
        return rows as Complaint[];
    }

    async getPendingComplaints(): Promise<Complaint[]> {
        const [rows] = await pool.execute(`
            SELECT c.*, t.name as tenant_name, t.phone as tenant_phone
            FROM COMPLAINT c
            JOIN TENANT t ON c.tenant_id = t.tenant_id
            WHERE c.status = "pending"
            ORDER BY c.created_at ASC
        `);
        return rows as Complaint[];
    }

    async getResolvedComplaints(): Promise<Complaint[]> {
        const [rows] = await pool.execute(`
            SELECT c.*, t.name as tenant_name, t.phone as tenant_phone
            FROM COMPLAINT c
            JOIN TENANT t ON c.tenant_id = t.tenant_id
            WHERE c.status = "resolved"
            ORDER BY c.created_at DESC
        `);
        return rows as Complaint[];
    }

    async updateComplaintStatus(complaintId: number, status: string): Promise<Complaint | null> {
        await pool.execute(
            'UPDATE COMPLAINT SET status = ? WHERE complaint_id = ?',
            [status, complaintId]
        );
        return this.getComplaintById(complaintId);
    }
}
