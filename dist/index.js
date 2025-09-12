import express from "express";
import todoroute from "./routes/todoRoute.js";
const app = express();
const port = 3010;
app.use(express.json());
app.use('/todos', todoroute);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map