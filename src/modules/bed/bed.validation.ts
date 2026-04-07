import { createValidationMiddleware } from '../../utils/validation';
import { bedSchema, updateBedSchema } from '../../utils/validation';


// Apply validation middleware
export const validateBedRequest = createValidationMiddleware({
  '/': {
    post: bedSchema,
  },
  '/:id': {
    put: updateBedSchema,
  },
});

