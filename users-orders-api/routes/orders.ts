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

router.get("/users/:id/orders/:orderId",
    (req: Request, res: Request): void => {
        // Get one specific order

        const userId: number = Number(req.params.id);
        const orderId: number = Number(req.params.orderId);


        const order: Order | undefined = orders.find(
            (order: Order) =>
                order.userId === userId &&
                order.orderId === orderId
        );

        if (!order) {
            res.status(404).json({
                message: "Order not found !!"
            })
        }

        res.status(200).json(order);

    }
);


export default router;