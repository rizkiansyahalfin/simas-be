import { Router } from 'express';
import { InventoryController } from './inventory.controller';
const router = Router();
// GET /inventories?condition=baik&category=elektronik&search=laptop
router.get('/', InventoryController.findAll);
router.get('/:id', InventoryController.findById);
router.post('/', InventoryController.create);
router.put('/:id', InventoryController.update);
router.delete('/:id', InventoryController.delete);
export default router;
