import { createValidationMiddleware } from '../../utils/validation';
import { paymentSchema, updatePaymentSchema } from '../../utils/validation';

// Apply validation middleware
export const validatePaymentRequest = createValidationMiddleware({
  '/': {
    post: paymentSchema,
  },
  '/:id': {
    put: updatePaymentSchema,
  },
});