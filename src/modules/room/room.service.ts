import pool from '../../config/database';

export interface Room {
    room_id: number;
    room_type: string;
    rent: number;
    status: string;
}

export class RoomService {
    async getAllRooms(): Promise<Room[]> {
        const [rows] = await pool.execute('SELECT * FROM ROOM');
        return rows as Room[];
    }

    async getRoomById(roomId: number): Promise<Room | null> {
        const [rows] = await pool.execute('SELECT * FROM ROOM WHERE room_id = ?', [roomId]);
        const rooms = rows as Room[];
        return rooms.length > 0 ? rooms[0] : null;
    }

    async createRoom(room: Omit<Room, 'room_id'>): Promise<Room> {
        const [result] = await pool.execute(
            'INSERT INTO ROOM (room_type, rent, status) VALUES (?, ?, ?)',
            [room.room_type, room.rent, room.status]
        );
        const insertId = (result as any).insertId;
        return { room_id: insertId, ...room };
    }

    async updateRoom(roomId: number, room: Partial<Omit<Room, 'room_id'>>): Promise<Room | null> {
        const fields = [];
        const values = [];
        
        if (room.room_type !== undefined) {
            fields.push('room_type = ?');
            values.push(room.room_type);
        }
        if (room.rent !== undefined) {
            fields.push('rent = ?');
            values.push(room.rent);
        }
        if (room.status !== undefined) {
            fields.push('status = ?');
            values.push(room.status);
        }
        
        if (fields.length === 0) {
            return this.getRoomById(roomId);
        }
        
        values.push(roomId);
        await pool.execute(
            `UPDATE ROOM SET ${fields.join(', ')} WHERE room_id = ?`,
            values
        );
        
        return this.getRoomById(roomId);
    }

    async deleteRoom(roomId: number): Promise<boolean> {
        const [result] = await pool.execute('DELETE FROM ROOM WHERE room_id = ?', [roomId]);
        return (result as any).affectedRows > 0;
    }

    async getAvailableRooms(): Promise<Room[]> {
        const [rows] = await pool.execute('SELECT * FROM ROOM WHERE status = "available"');
        return rows as Room[];
    }
}
