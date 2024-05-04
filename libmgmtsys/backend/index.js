import express from "express";
import router from "./config/routes.js";
import cors from "cors";

const port = 5172;
const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.use("/", router);

app.listen(port, () => console.log(`Server running at port ${port}`));