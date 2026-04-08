import { Request, Response, NextFunction } from 'express';
import { object, string, number, optional, date, safeParseAsync } from 'valibot';


// Validation schemas
export const roomSchema = object({
  room_type: string('Room type is required'),
  rent: number('Rent is required and must be a number'),
  status: string('Status is required')
});

export const bedSchema = object({
  room_id: number('Room ID is required and must be a number'),
  bed_number: number('Bed number is required and must be a number'),
  status: string('Status is required')
});

export const tenantSchema = object({
  name: string('Name is required'),
  phone: string('Phone is required'),
  aadhaar: string('Aadhaar is required'),
  join_date: string('Join date is required'),
  bed_id: number('Bed ID is required and must be a number')
});

export const paymentSchema = object({
  tenant_id: number('Tenant ID is required and must be a number'),
  amount: number('Amount is required and must be a number'),
  payment_date: string('Payment date is required'),
  payment_mode: string('Payment mode is required'),
  status: string('Status is required')
});

export const foodMenuSchema = object({
  day: string('Day is required'),
  breakfast: string('Breakfast is required'),
  lunch: string('Lunch is required'),
  dinner: string('Dinner is required')
});

export const complaintSchema = object({
  tenant_id: number('Tenant ID is required and must be a number'),
  description: string('Description is required'),
  status: string('Status is required')
});

// Update schemas (partial for PUT requests)
export const updateRoomSchema = object({
  room_type: optional(string('Room type must be a string')),
  rent: optional(number('Rent must be a number')),
  status: optional(string('Status must be a string'))
});

export const updateBedSchema = object({
  room_id: optional(number('Room ID must be a number')),
  bed_number: optional(number('Bed number must be a number')),
  status: optional(string('Status must be a string'))
});

export const updateTenantSchema = object({
  name: optional(string('Name must be a string')),
  phone: optional(string('Phone must be a string')),
  aadhaar: optional(string('Aadhaar must be a string')),
  join_date: optional(string('Join date must be a string')),
  bed_id: optional(number('Bed ID must be a number'))
});

export const updatePaymentSchema = object({
  tenant_id: optional(number('Tenant ID must be a number')),
  amount: optional(number('Amount must be a number')),
  payment_date: optional(string('Payment date must be a string')),
  payment_mode: optional(string('Payment mode must be a string')),
  status: optional(string('Status must be a string'))
});

export const updateFoodMenuSchema = object({
  day: optional(string('Day must be a string')),
  breakfast: optional(string('Breakfast must be a string')),
  lunch: optional(string('Lunch must be a string')),
  dinner: optional(string('Dinner must be a string'))
});

export const updateComplaintSchema = object({
  tenant_id: optional(number('Tenant ID must be a number')),
  description: optional(string('Description must be a string')),
  status: optional(string('Status must be a string'))
});

// Validation middleware factory
export const createValidationMiddleware = (schemas: Record<string, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const path = req.route?.path || req.path as string;
      const method = req.method.toLowerCase();
      
      let schema = null;
      
      // Find the matching schema for this route and method
      for (const [route, routeSchemas] of Object.entries(schemas)) {
        if (path.includes(route)) {
          if (method === 'post' && routeSchemas.post) {
            schema = routeSchemas.post;
            break;
          } else if (method === 'put' && routeSchemas.put) {
            schema = routeSchemas.put;
            break;
          }
        }
      }
      
      if (!schema) {
        return next();
      }
      
      const result = await safeParseAsync(schema, req.body, {
        abortEarly: true
      });
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: result.issues.map(issue => ({
            field: issue.path?.join('.') || 'unknown',
            message: issue.message
          }))
        });
      }
      console.log("/////////////////////////////")
        console.log("result", result);
        console.log("result.output", result.output)
      console.log("/////////////////////////////")
      // Replace req.body with validated data
      req.body = result.output;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Validation error',
        error: (error as Error).message
      });
    }
  };
};

// ID validation middleware
export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  
  if (!id || isNaN(parseInt(id as string))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID parameter'
    });
  }
  
  next();
};
