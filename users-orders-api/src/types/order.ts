export interface Order {
    orderId: number;
    userId: number;
    item: string;
    amount: number;
    status: string;
    createdAt?: Date;
}