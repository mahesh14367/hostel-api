import { Router } from 'express';
import { TenantController } from './tenant.controller';
import { validateId } from '../../utils/validation';
import { validateTenantRequest } from './tenant.validation';

const router = Router();
const tenantController = new TenantController();

// GET /api/tenants - Get all tenants
router.get('/', tenantController.getAllTenants);

// GET /api/tenants/phone/:phone - Get tenant by phone
router.get('/phone/:phone', tenantController.getTenantByPhone);

// GET /api/tenants/aadhaar/:aadhaar - Get tenant by Aadhaar
router.get('/aadhaar/:aadhaar', tenantController.getTenantByAadhaar);

// GET /api/tenants/room/:roomId - Get tenants by room
router.get('/room/:roomId', tenantController.getTenantsByRoom);

// GET /api/tenants/:id - Get tenant by ID
router.get('/:id', validateId, tenantController.getTenantById);

// POST /api/tenants - Create new tenant
router.post('/', validateTenantRequest, tenantController.createTenant);

// PUT /api/tenants/:id - Update tenant
router.put('/:id', validateId, validateTenantRequest, tenantController.updateTenant);

// DELETE /api/tenants/:id - Delete tenant
router.delete('/:id', validateId, tenantController.deleteTenant);

export default router;
