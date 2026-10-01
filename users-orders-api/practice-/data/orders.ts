

export interface Order {
  orderId :number,
  userId: number;
  item: string;
  amount: number;
  status: string;
} 

const orders: Order[]=[
  {
    orderId: 501,
    userId: 101,
    item: "Nike Shoes",
    amount: 4999,
    status: "completed"
  },
  {
    orderId: 502,
    userId: 101,
    item: "T-Shirt",
    amount: 999,
    status: "pending"
  },
  {
    orderId: 503,
    userId: 102,
    item: "Laptop",
    amount: 65000,
    status: "completed"
  }
];

export default orders;