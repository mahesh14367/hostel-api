import express from "express";
import roomRoutes from "./modules/room/room.routes";
import bedRoutes from "./modules/bed/bed.routes";
import tenantRoutes from "./modules/tenant/tenant.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import foodMenuRoutes from "./modules/food-menu/food-menu.routes";
import complaintRoutes from "./modules/complaint/complaint.routes";

const router = express.Router();

// Health check
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Hostel API is running!",
        timestamp: new Date().toISOString()
    });
});

// Module routes
router.use("/rooms", roomRoutes);
router.use("/beds", bedRoutes);
router.use("/tenants", tenantRoutes);
router.use("/payments", paymentRoutes);
router.use("/food-menu", foodMenuRoutes);
router.use("/complaints", complaintRoutes);

export default router;