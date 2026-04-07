import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { validateId } from '../../utils/validation';
import { validatePaymentRequest } from './payment.validation';

const router = Router();
const paymentController = new PaymentController();

// GET /api/payments - Get all payments
router.get('/', paymentController.getAllPayments);

// GET /api/payments/pending - Get pending payments
router.get('/pending', paymentController.getPendingPayments);

// GET /api/payments/revenue - Get total revenue
router.get('/revenue', paymentController.getTotalRevenue);

// GET /api/payments/status/:status - Get payments by status
router.get('/status/:status', paymentController.getPaymentsByStatus);

// GET /api/payments/date-range - Get payments by date range
router.get('/date-range', paymentController.getPaymentsByDateRange);

// GET /api/payments/tenant/:tenantId - Get payments by tenant
router.get('/tenant/:tenantId', paymentController.getPaymentsByTenant);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', validateId, paymentController.getPaymentById);

// POST /api/payments - Create new payment
router.post('/', validatePaymentRequest, paymentController.createPayment);

// PUT /api/payments/:id - Update payment
router.put('/:id', validateId, validatePaymentRequest, paymentController.updatePayment);

// DELETE /api/payments/:id - Delete payment
router.delete('/:id', validateId, paymentController.deletePayment);

export default router;
