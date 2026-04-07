import { createValidationMiddleware } from '../../utils/validation';
import { roomSchema, updateRoomSchema } from '../../utils/validation';

// Apply validation middleware
export const validateRoomRequest = createValidationMiddleware({
  '/': {
    post: roomSchema,
  },
  '/:id': {
    put: updateRoomSchema,
  },
});