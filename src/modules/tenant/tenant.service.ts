import pool from '../../config/database';

export interface Tenant {
    tenant_id: number;
    name: string;
    phone: string;
    aadhaar: string;
    join_date: Date;
    bed_id: number;
    bed_number?: number;
    room_type?: string;
}

export class TenantService {
    async getAllTenants(): Promise<Tenant[]> {
        const [rows] = await pool.execute(`
            SELECT t.*, b.bed_number, r.room_type
            FROM TENANT t
            JOIN BED b ON t.bed_id = b.bed_id
            JOIN ROOM r ON b.room_id = r.room_id
        `);
        return rows as Tenant[];
    }

    async getTenantById(tenantId: number): Promise<Tenant | null> {
        const [rows] = await pool.execute(`
            SELECT t.*, b.bed_number, r.room_type
            FROM TENANT t
            JOIN BED b ON t.bed_id = b.bed_id
            JOIN ROOM r ON b.room_id = r.room_id
            WHERE t.tenant_id = ?
        `, [tenantId]);
        const tenants = rows as Tenant[];
        return tenants.length > 0 ? tenants[0] : null;
    }

    async createTenant(tenant: Omit<Tenant, 'tenant_id'>): Promise<Tenant> {
        const [result] = await pool.execute(
            'INSERT INTO TENANT (name, phone, aadhaar, join_date, bed_id) VALUES (?, ?, ?, ?, ?)',
            [tenant.name, tenant.phone, tenant.aadhaar, tenant.join_date, tenant.bed_id]
        );
        
        // Update bed status to occupied
        await pool.execute(
            'UPDATE BED SET status = "occupied" WHERE bed_id = ?',
            [tenant.bed_id]
        );
        
        const insertId = (result as any).insertId;
        return { tenant_id: insertId, ...tenant };
    }

    async updateTenant(tenantId: number, tenant: Partial<Omit<Tenant, 'tenant_id'>>): Promise<Tenant | null> {
        const fields = [];
        const values = [];
        
        if (tenant.name !== undefined) {
            fields.push('name = ?');
            values.push(tenant.name);
        }
        if (tenant.phone !== undefined) {
            fields.push('phone = ?');
            values.push(tenant.phone);
        }
        if (tenant.aadhaar !== undefined) {
            fields.push('aadhaar = ?');
            values.push(tenant.aadhaar);
        }
        if (tenant.join_date !== undefined) {
            fields.push('join_date = ?');
            values.push(tenant.join_date);
        }
        if (tenant.bed_id !== undefined) {
            // Get old bed_id to update its status
            const oldTenant = await this.getTenantById(tenantId);
            if (oldTenant) {
                await pool.execute(
                    'UPDATE BED SET status = "available" WHERE bed_id = ?',
                    [oldTenant.bed_id]
                );
            }
            
            fields.push('bed_id = ?');
            values.push(tenant.bed_id);
            
            // Update new bed status to occupied
            await pool.execute(
                'UPDATE BED SET status = "occupied" WHERE bed_id = ?',
                [tenant.bed_id]
            );
        }
        
        if (fields.length === 0) {
            return this.getTenantById(tenantId);
        }
        
        values.push(tenantId);
        await pool.execute(
            `UPDATE TENANT SET ${fields.join(', ')} WHERE tenant_id = ?`,
            values
        );
        
        return this.getTenantById(tenantId);
    }

    async deleteTenant(tenantId: number): Promise<boolean> {
        const tenant = await this.getTenantById(tenantId);
        if (tenant) {
            // Update bed status to available
            await pool.execute(
                'UPDATE BED SET status = "available" WHERE bed_id = ?',
                [tenant.bed_id]
            );
        }
        
        const [result] = await pool.execute('DELETE FROM TENANT WHERE tenant_id = ?', [tenantId]);
        return (result as any).affectedRows > 0;
    }

    async getTenantsByRoom(roomId: number): Promise<Tenant[]> {
        const [rows] = await pool.execute(`
            SELECT t.*, b.bed_number, r.room_type, r.room_number
            FROM TENANT t
            JOIN BED b ON t.bed_id = b.bed_id
            JOIN ROOM r ON b.room_id = r.room_id
            WHERE b.room_id = ?
        `, [roomId]);
        return rows as Tenant[];
    }

    async getTenantByPhone(phone: string): Promise<Tenant | null> {
        const [rows] = await pool.execute(`
            SELECT t.*, b.bed_number, r.room_type, r.room_number
            FROM TENANT t
            JOIN BED b ON t.bed_id = b.bed_id
            JOIN ROOM r ON b.room_id = r.room_id
            WHERE t.phone = ?
        `, [phone]);
        const tenants = rows as Tenant[];
        return tenants.length > 0 ? tenants[0] : null;
    }

    async getTenantByAadhaar(aadhaar: string): Promise<Tenant | null> {
        const [rows] = await pool.execute(`
            SELECT t.*, b.bed_number, r.room_type, r.room_number
            FROM TENANT t
            JOIN BED b ON t.bed_id = b.bed_id
            JOIN ROOM r ON b.room_id = r.room_id
            WHERE t.aadhaar = ?
        `, [aadhaar]);
        const tenants = rows as Tenant[];
        return tenants.length > 0 ? tenants[0] : null;
    }
}
