import express, { Request, response, Response } from "express";

import orders, { Order } from "../data/orders";
import { request } from "node:http";

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
    (req: Request, res: Response): void => {
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

router.post(
    "/users/:id/orders",
    (req: Request, res: Response): void => {
        const userId: number = Number(req.params.params);

        if (isNaN(userId)) {
            res.status(404).json({
                message: " User id i srequired"
            });
        }

        const { item, amount, status } = req.body;

        // 3. Create order
        const newOrder: Order = {
            orderId: orders.length + 501,
            userId: userId,
            item: req.body.item,
            amount: req.body.amount,
            status: req.body.status
        };

        orders.push(newOrder);

        res.status(200).json({
            message: "Created success"
        })
    }
);


export default router;