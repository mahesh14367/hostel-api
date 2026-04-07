import { Request, Response } from 'express';
import { FoodMenuService, FoodMenu } from './food-menu.service';

export class FoodMenuController {
    private foodMenuService: FoodMenuService;

    constructor() {
        this.foodMenuService = new FoodMenuService();
    }

    getAllFoodMenus = async (req: Request, res: Response) => {
        try {
            const menus = await this.foodMenuService.getAllFoodMenus();
            res.json({
                success: true,
                data: menus,
                message: 'Food menus retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving food menus',
                error: (error as Error).message
            });
        }
    };

    getFoodMenuById = async (req: Request, res: Response) => {
        try {
            const menuId = parseInt(req.params.id as string);
            if (isNaN(menuId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid menu ID'
                });
            }

            const menu = await this.foodMenuService.getFoodMenuById(menuId);
            if (!menu) {
                return res.status(404).json({
                    success: false,
                    message: 'Food menu not found'
                });
            }

            res.json({
                success: true,
                data: menu,
                message: 'Food menu retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving food menu',
                error: (error as Error).message
            });
        }
    };

    getFoodMenuByDay = async (req: Request, res: Response) => {
        try {
            const day = req.params.day as string;
            
            if (!day) {
                return res.status(400).json({
                    success: false,
                    message: 'Day is required'
                });
            }

            const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            if (!validDays.includes(day)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'
                });
            }

            const menu = await this.foodMenuService.getFoodMenuByDay(day);
            if (!menu) {
                return res.status(404).json({
                    success: false,
                    message: 'Food menu not found for this day'
                });
            }

            res.json({
                success: true,
                data: menu,
                message: 'Food menu retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving food menu',
                error: (error as Error).message
            });
        }
    };

    createFoodMenu = async (req: Request, res: Response) => {
        try {
            const { day, breakfast, lunch, dinner } = req.body;

            // Validation
            if (!day || !breakfast || !lunch || !dinner) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: day, breakfast, lunch, dinner'
                });
            }

            const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            if (!validDays.includes(day)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'
                });
            }

            const menuData: Omit<FoodMenu, 'menu_id'> = {
                day,
                breakfast,
                lunch,
                dinner
            };

            const newMenu = await this.foodMenuService.createFoodMenu(menuData);
            res.status(201).json({
                success: true,
                data: newMenu,
                message: 'Food menu created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating food menu',
                error: (error as Error).message
            });
        }
    };

    updateFoodMenu = async (req: Request, res: Response) => {
        try {
            const menuId = parseInt(req.params.id as string);
            if (isNaN(menuId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid menu ID'
                });
            }

            const updateData = req.body;
            
            if (updateData.day !== undefined) {
                const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                if (!validDays.includes(updateData.day)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'
                    });
                }
            }

            const updatedMenu = await this.foodMenuService.updateFoodMenu(menuId, updateData);
            if (!updatedMenu) {
                return res.status(404).json({
                    success: false,
                    message: 'Food menu not found'
                });
            }

            res.json({
                success: true,
                data: updatedMenu,
                message: 'Food menu updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating food menu',
                error: (error as Error).message
            });
        }
    };

    deleteFoodMenu = async (req: Request, res: Response) => {
        try {
            const menuId = parseInt(req.params.id as string);
            if (isNaN(menuId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid menu ID'
                });
            }

            const deleted = await this.foodMenuService.deleteFoodMenu(menuId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Food menu not found'
                });
            }

            res.json({
                success: true,
                message: 'Food menu deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting food menu',
                error: (error as Error).message
            });
        }
    };

    getWeeklyMenu = async (req: Request, res: Response) => {
        try {
            const menus = await this.foodMenuService.getWeeklyMenu();
            res.json({
                success: true,
                data: menus,
                message: 'Weekly menu retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving weekly menu',
                error: (error as Error).message
            });
        }
    };

    updateMenuByDay = async (req: Request, res: Response) => {
        try {
            const day = req.params.day as string;
            const { breakfast, lunch, dinner } = req.body;
            
            if (!day) {
                return res.status(400).json({
                    success: false,
                    message: 'Day is required'
                });
            }

            const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            if (!validDays.includes(day)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid day. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'
                });
            }

            const updateData: Partial<Omit<FoodMenu, 'menu_id' | 'day'>> = {};
            if (breakfast !== undefined) updateData.breakfast = breakfast;
            if (lunch !== undefined) updateData.lunch = lunch;
            if (dinner !== undefined) updateData.dinner = dinner;

            const updatedMenu = await this.foodMenuService.updateMenuByDay(day, updateData);
            if (!updatedMenu) {
                return res.status(404).json({
                    success: false,
                    message: 'Food menu not found for this day'
                });
            }

            res.json({
                success: true,
                data: updatedMenu,
                message: 'Food menu updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating food menu',
                error: (error as Error).message
            });
        }
    };

    getTodayMenu = async (req: Request, res: Response) => {
        try {
            const menu = await this.foodMenuService.getTodayMenu();
            if (!menu) {
                return res.status(404).json({
                    success: false,
                    message: 'No menu found for today'
                });
            }

            res.json({
                success: true,
                data: menu,
                message: "Today's menu retrieved successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving today\'s menu',
                error: (error as Error).message
            });
        }
    };
}
