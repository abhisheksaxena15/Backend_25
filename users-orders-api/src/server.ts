import express from "express";
import orderRoutes from "./routes/orders";

const app = express();

app.use(express.json());
app.use("/", orderRoutes);

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
