import type { Request, Response } from "express";
import { findUserOrders } from "../services/orders";

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