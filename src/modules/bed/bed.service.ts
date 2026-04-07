import pool from '../../config/database';

export interface Bed {
    bed_id: number;
    room_id: number;
    bed_number: number;
    status: string;
}

export class BedService {
    async getAllBeds(): Promise<Bed[]> {
        const [rows] = await pool.execute('SELECT * FROM BED');
        return rows as Bed[];
    }

    async getBedById(bedId: number): Promise<Bed | null> {
        const [rows] = await pool.execute('SELECT * FROM BED WHERE bed_id = ?', [bedId]);
        const beds = rows as Bed[];
        return beds.length > 0 ? beds[0] : null;
    }

    async getBedsByRoom(roomId: number): Promise<Bed[]> {
        const [rows] = await pool.execute('SELECT * FROM BED WHERE room_id = ?', [roomId]);
        return rows as Bed[];
    }

    async createBed(bed: Bed): Promise<Bed> {
        const [result] = await pool.execute(
            'INSERT INTO BED (bed_id, room_id, bed_number, status) VALUES (?, ?, ?, ?)',
            [bed.bed_id, bed.room_id, bed.bed_number, bed.status]
        );
        const insertId = (result as any).insertId;
        return { bed_id: insertId, ...bed };
    }

    async updateBed(bedId: number, bed: Partial<Omit<Bed, 'bed_id'>>): Promise<Bed | null> {
        const fields = [];
        const values = [];
        
        if (bed.room_id !== undefined) {
            fields.push('room_id = ?');
            values.push(bed.room_id);
        }
        if (bed.bed_number !== undefined) {
            fields.push('bed_number = ?');
            values.push(bed.bed_number);
        }
        if (bed.status !== undefined) {
            fields.push('status = ?');
            values.push(bed.status);
        }
        
        if (fields.length === 0) {
            return this.getBedById(bedId);
        }
        
        values.push(bedId);
        await pool.execute(
            `UPDATE BED SET ${fields.join(', ')} WHERE bed_id = ?`,
            values
        );
        
        return this.getBedById(bedId);
    }

    async deleteBed(bedId: number): Promise<boolean> {
        const [result] = await pool.execute('DELETE FROM BED WHERE bed_id = ?', [bedId]);
        return (result as any).affectedRows > 0;
    }

    async getAvailableBeds(): Promise<Bed[]> {
        const [rows] = await pool.execute('SELECT * FROM BED WHERE status = "available"');
        return rows as Bed[];
    }

    async getAvailableBedsByRoom(roomId: number): Promise<Bed[]> {
        const [rows] = await pool.execute(
            'SELECT * FROM BED WHERE room_id = ? AND status = "available"',
            [roomId]
        );
        return rows as Bed[];
    }
}
