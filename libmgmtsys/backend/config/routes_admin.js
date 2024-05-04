import { Router } from "express";
import * as authC from "../controllers/auth.js";
import * as userC from "../controllers/user.js";
import * as middleware from "./middleware.js";

const admin_router = new Router();

// Admin routes

admin_router.use(middleware.isAdmin); // Works
admin_router.post("/user", userC.createUser); // Works
admin_router.put("/user/:id", userC.updateUser); // Works
admin_router.delete("/user/:id", userC.deleteUser); // Works
admin_router.get("/users", userC.getAllUsers); // Works

export default admin_router;