import express, { type Request, type Response } from "express";
import { getUserOrders , getSingleOrder} from "../controllers/orders";

const router = express.Router();

router.get("/users/:id/orders", (req: Request, res: Response) => getUserOrders(req, res));

// get singlge order
router.get('/users/:id/orderid', ( req: Request, res: Response) => getSingleOrder(req, res));

export default router;