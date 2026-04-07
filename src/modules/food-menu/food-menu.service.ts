import pool from '../../config/database';

export interface FoodMenu {
    menu_id: number;
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
}

export class FoodMenuService {
    async getAllFoodMenus(): Promise<FoodMenu[]> {
        const [rows] = await pool.execute('SELECT * FROM FOOD_MENU ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")');
        return rows as FoodMenu[];
    }

    async getFoodMenuById(menuId: number): Promise<FoodMenu | null> {
        const [rows] = await pool.execute('SELECT * FROM FOOD_MENU WHERE menu_id = ?', [menuId]);
        const menus = rows as FoodMenu[];
        return menus.length > 0 ? menus[0] : null;
    }

    async getFoodMenuByDay(day: string): Promise<FoodMenu | null> {
        const [rows] = await pool.execute('SELECT * FROM FOOD_MENU WHERE day = ?', [day]);
        const menus = rows as FoodMenu[];
        return menus.length > 0 ? menus[0] : null;
    }

    async createFoodMenu(menu: Omit<FoodMenu, 'menu_id'>): Promise<FoodMenu> {
        const [result] = await pool.execute(
            'INSERT INTO FOOD_MENU (day, breakfast, lunch, dinner) VALUES (?, ?, ?, ?)',
            [menu.day, menu.breakfast, menu.lunch, menu.dinner]
        );
        const insertId = (result as any).insertId;
        return { menu_id: insertId, ...menu };
    }

    async updateFoodMenu(menuId: number, menu: Partial<Omit<FoodMenu, 'menu_id'>>): Promise<FoodMenu | null> {
        const fields = [];
        const values = [];
        
        if (menu.day !== undefined) {
            fields.push('day = ?');
            values.push(menu.day);
        }
        if (menu.breakfast !== undefined) {
            fields.push('breakfast = ?');
            values.push(menu.breakfast);
        }
        if (menu.lunch !== undefined) {
            fields.push('lunch = ?');
            values.push(menu.lunch);
        }
        if (menu.dinner !== undefined) {
            fields.push('dinner = ?');
            values.push(menu.dinner);
        }
        
        if (fields.length === 0) {
            return this.getFoodMenuById(menuId);
        }
        
        values.push(menuId);
        await pool.execute(
            `UPDATE FOOD_MENU SET ${fields.join(', ')} WHERE menu_id = ?`,
            values
        );
        
        return this.getFoodMenuById(menuId);
    }

    async deleteFoodMenu(menuId: number): Promise<boolean> {
        const [result] = await pool.execute('DELETE FROM FOOD_MENU WHERE menu_id = ?', [menuId]);
        return (result as any).affectedRows > 0;
    }

    async getWeeklyMenu(): Promise<FoodMenu[]> {
        const [rows] = await pool.execute('SELECT * FROM FOOD_MENU ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")');
        return rows as FoodMenu[];
    }

    async updateMenuByDay(day: string, menu: Partial<Omit<FoodMenu, 'menu_id' | 'day'>>): Promise<FoodMenu | null> {
        const fields = [];
        const values = [];
        
        if (menu.breakfast !== undefined) {
            fields.push('breakfast = ?');
            values.push(menu.breakfast);
        }
        if (menu.lunch !== undefined) {
            fields.push('lunch = ?');
            values.push(menu.lunch);
        }
        if (menu.dinner !== undefined) {
            fields.push('dinner = ?');
            values.push(menu.dinner);
        }
        
        if (fields.length === 0) {
            return this.getFoodMenuByDay(day);
        }
        
        values.push(day);
        await pool.execute(
            `UPDATE FOOD_MENU SET ${fields.join(', ')} WHERE day = ?`,
            values
        );
        
        return this.getFoodMenuByDay(day);
    }

    async getTodayMenu(): Promise<FoodMenu | null> {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];
        return this.getFoodMenuByDay(today);
    }
}
