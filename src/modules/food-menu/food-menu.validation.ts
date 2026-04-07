import { createValidationMiddleware } from '../../utils/validation';
import { foodMenuSchema, updateFoodMenuSchema } from '../../utils/validation';

// Apply validation middleware
export const validateFoodMenuRequest = createValidationMiddleware({
  '/': {
    post: foodMenuSchema,
  },
  '/:id': {
    put: updateFoodMenuSchema,
  },
  '/day/:day': {
    put: updateFoodMenuSchema,
  },
});