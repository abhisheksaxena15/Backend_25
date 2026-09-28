import express, { Request, Response } from "express";

import orders, { Order } from "../data/orders";

const router = express.Router();

router.get(
  "/users/:id/orders",
  (req: Request, res: Response): void => {

    const userId: number = Number(req.params.id);

    const userOrders: Order[] = orders.filter(
      (order: Order) => order.userId === userId
    );

    res.status(200).json(userOrders);
  }
);

export default router;