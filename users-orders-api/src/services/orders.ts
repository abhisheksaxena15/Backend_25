import pool from "../db/database";
import type { Order } from "../types/order";

export async function findUserOrders(
    userId: number,
    page: number,
    limit: number,
    status?: string
): Promise<{ userId: number; page: number; limit: number; totalOrders: number; orders: Order[] }> {
    const offset = (page - 1) * limit;

    let query = `
        SELECT
            order_id AS "orderId",
            user_id AS "userId",
            item,
            amount,
            status,
            created_at AS "createdAt"
        FROM orders
        WHERE user_id = $1
    `;

    const values: unknown[] = [userId];

    if (status) {
        query += ` AND status = $2`;
        values.push(status);
    }

    query += `
        ORDER BY created_at DESC
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

    values.push(limit, offset);

    const result = await pool.query<Order>(query, values);

    let countQuery = `
        SELECT COUNT(*)::int AS total
        FROM orders
        WHERE user_id = $1
    `;

    const countValues: unknown[] = [userId];

    if (status) {
        countQuery += ` AND status = $2`;
        countValues.push(status);
    }

    const countResult = await pool.query<{ total: number }>(countQuery, countValues);

    return {
        userId,
        page,
        limit,
        totalOrders: Number(countResult.rows[0]?.total ?? 0),
        orders: result.rows as Order[]
    };
}