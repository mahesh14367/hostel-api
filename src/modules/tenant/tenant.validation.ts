import { createValidationMiddleware } from '../../utils/validation';
import { tenantSchema, updateTenantSchema } from '../../utils/validation';

// Apply validation middleware
export const validateTenantRequest = createValidationMiddleware({
  '/': {
    post: tenantSchema,
  },
  '/:id': {
    put: updateTenantSchema,
  },
});