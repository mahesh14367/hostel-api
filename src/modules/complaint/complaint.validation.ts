import { createValidationMiddleware } from '../../utils/validation';
import { complaintSchema, updateComplaintSchema } from '../../utils/validation';

// Apply validation middleware
export const validateComplaintRequest = createValidationMiddleware({
  '/': {
    post: complaintSchema,
  },
  '/:id': {
    put: updateComplaintSchema,
  },
});