import { Router } from 'express';
import { FoodMenuController } from './food-menu.controller';
import { validateId } from '../../utils/validation';
import { validateFoodMenuRequest } from './food-menu.validation';

const router = Router();
const foodMenuController = new FoodMenuController();

// GET /api/food-menu - Get all food menus
router.get('/', foodMenuController.getAllFoodMenus);

// GET /api/food-menu/weekly - Get weekly menu
router.get('/weekly', foodMenuController.getWeeklyMenu);

// GET /api/food-menu/today - Get today's menu
router.get('/today', foodMenuController.getTodayMenu);

// GET /api/food-menu/day/:day - Get menu by day
router.get('/day/:day', foodMenuController.getFoodMenuByDay);

// PUT /api/food-menu/day/:day - Update menu by day
router.put('/day/:day', validateFoodMenuRequest, foodMenuController.updateMenuByDay);

// GET /api/food-menu/:id - Get menu by ID
router.get('/:id', validateId, foodMenuController.getFoodMenuById);

// POST /api/food-menu - Create new food menu
router.post('/', validateFoodMenuRequest, foodMenuController.createFoodMenu);

// PUT /api/food-menu/:id - Update food menu
router.put('/:id', validateId, validateFoodMenuRequest, foodMenuController.updateFoodMenu);

// DELETE /api/food-menu/:id - Delete food menu
router.delete('/:id', validateId, foodMenuController.deleteFoodMenu);

export default router;
