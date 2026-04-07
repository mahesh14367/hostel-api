import { Request, Response } from 'express';
import { PaymentService, Payment } from './payment.service';

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    getAllPayments = async (req: Request, res: Response) => {
        try {
            const payments = await this.paymentService.getAllPayments();
            res.json({
                success: true,
                data: payments,
                message: 'Payments retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving payments',
                error: (error as Error).message
            });
        }
    };

    getPaymentById = async (req: Request, res: Response) => {
        try {
            const paymentId = parseInt(req.params.id as string);
            if (isNaN(paymentId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment ID'
                });
            }

            const payment = await this.paymentService.getPaymentById(paymentId);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            res.json({
                success: true,
                data: payment,
                message: 'Payment retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving payment',
                error: (error as Error).message
            });
        }
    };

    createPayment = async (req: Request, res: Response) => {
        try {
            const { tenant_id, amount, payment_date, payment_mode, status } = req.body;

            // Validation
            if (!tenant_id || amount === undefined || !payment_date || !payment_mode || !status) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: tenant_id, amount, payment_date, payment_mode, status'
                });
            }

            const paymentData: Omit<Payment, 'payment_id'> = {
                tenant_id: parseInt(tenant_id),
                amount: parseFloat(amount),
                payment_date: new Date(payment_date),
                payment_mode,
                status
            };

            const newPayment = await this.paymentService.createPayment(paymentData);
            res.status(201).json({
                success: true,
                data: newPayment,
                message: 'Payment created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating payment',
                error: (error as Error).message
            });
        }
    };

    updatePayment = async (req: Request, res: Response) => {
        try {
            const paymentId = parseInt(req.params.id as string);
            if (isNaN(paymentId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment ID'
                });
            }

            const updateData = req.body;
            if (updateData.tenant_id !== undefined) {
                updateData.tenant_id = parseInt(updateData.tenant_id);
            }
            if (updateData.amount !== undefined) {
                updateData.amount = parseFloat(updateData.amount);
            }
            if (updateData.payment_date !== undefined) {
                updateData.payment_date = new Date(updateData.payment_date);
            }

            const updatedPayment = await this.paymentService.updatePayment(paymentId, updateData);
            if (!updatedPayment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            res.json({
                success: true,
                data: updatedPayment,
                message: 'Payment updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating payment',
                error: (error as Error).message
            });
        }
    };

    deletePayment = async (req: Request, res: Response) => {
        try {
            const paymentId = parseInt(req.params.id as string);
            if (isNaN(paymentId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment ID'
                });
            }

            const deleted = await this.paymentService.deletePayment(paymentId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            res.json({
                success: true,
                message: 'Payment deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting payment',
                error: (error as Error).message
            });
        }
    };

    getPaymentsByTenant = async (req: Request, res: Response) => {
        try {
            const tenantId = parseInt(req.params.tenantId as string);
            if (isNaN(tenantId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid tenant ID'
                });
            }

            const payments = await this.paymentService.getPaymentsByTenant(tenantId);
            res.json({
                success: true,
                data: payments,
                message: 'Payments retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving payments',
                error: (error as Error).message
            });
        }
    };

    getPaymentsByDateRange = async (req: Request, res: Response) => {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date and end date are required'
                });
            }

            const payments = await this.paymentService.getPaymentsByDateRange(
                new Date(startDate as string),
                new Date(endDate as string)
            );
            
            res.json({
                success: true,
                data: payments,
                message: 'Payments retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving payments',
                error: (error as Error).message
            });
        }
    };

    getPaymentsByStatus = async (req: Request, res: Response) => {
        try {
            const status = req.params.status as string;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const payments = await this.paymentService.getPaymentsByStatus(status);
            res.json({
                success: true,
                data: payments,
                message: 'Payments retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving payments',
                error: (error as Error).message
            });
        }
    };

    getTotalRevenue = async (req: Request, res: Response) => {
        try {
            const { startDate, endDate } = req.query;
            
            let totalRevenue;
            if (startDate && endDate) {
                totalRevenue = await this.paymentService.getTotalRevenue(
                    new Date(startDate as string),
                    new Date(endDate as string)
                );
            } else {
                totalRevenue = await this.paymentService.getTotalRevenue();
            }
            
            res.json({
                success: true,
                data: { totalRevenue },
                message: 'Total revenue retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving total revenue',
                error: (error as Error).message
            });
        }
    };

    getPendingPayments = async (req: Request, res: Response) => {
        try {
            const payments = await this.paymentService.getPendingPayments();
            res.json({
                success: true,
                data: payments,
                message: 'Pending payments retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving pending payments',
                error: (error as Error).message
            });
        }
    };
}
