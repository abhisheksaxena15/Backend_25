import { Pool } from "pg";

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "YOUR_POSTGRES_PASSWORD",
    database: "orders_db"
});

export default pool;