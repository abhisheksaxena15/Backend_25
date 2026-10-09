import type { Request, Response } from "express";
import { findUserOrders, findSingleOrder } from "../services/orders";
import { request } from "node:http";
import { promiseHooks } from "node:v8";

export async function getUserOrders(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.id);

    if (Number.isNaN(userId)) {
        res.status(400).json({
            message: "User id is invalid"
        });
        return;
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const status = typeof req.query.status === "string" ? req.query.status : undefined;

    if (!Number.isFinite(page) || page < 1 || !Number.isFinite(limit) || limit < 1) {
        res.status(400).json({
            message: "page and limit must be greater than 0"
        });
        return;
    }

    const result = await findUserOrders(userId, page, limit, status);

    res.status(200).json({
        message: "Order view successfully",
        data: result
    });
}



export async function getSingleOrder(
    req: Request,
    res: Response
): Promise<void> {

    // 1. Get IDs from URL
    const userId = Number(req.params.id);
    const orderId = Number(req.params.orderId);

    // 2. Validate IDs
    if (
        !Number.isInteger(userId) ||
        !Number.isInteger(orderId) ||
        userId <= 0 ||
        orderId <= 0
    ) {
        res.status(400).json({
            message: "Invalid user ID or order ID"
        });
        return;
    }

    // 3. Fetch order from service/database
    const order = await findSingleOrder(userId, orderId);

    // 4. Check whether order exists
    if (!order) {
        res.status(404).json({
            message: "Order not found"
        });
        return;
    }

    // 5. Send successful response
    res.status(200).json({
        message: "Order view success",
        data: order
    });
}
