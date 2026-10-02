import express, { type Request, type Response } from "express";
import { getUserOrders } from "../controllers/orders";

const router = express.Router();

router.get("/users/:id/orders", (req: Request, res: Response) => getUserOrders(req, res));

export default router;