import { Router } from "express";
import * as middleware from "./middleware.js";
import * as requestC from "../controllers/request.js";
import * as reserveC from "../controllers/reserve.js";
import * as voteC from "../controllers/vote.js";

const member_router = new Router();

// Member routes
member_router.use(middleware.isMember);  // Works
member_router.post("/request", requestC.createRequest); // Works
member_router.post("/reserve", reserveC.createReserve); // Works
member_router.post("/vote", voteC.setVote); // Works
member_router.get("/vote/:userId/:requestId", voteC.getVote); // Works
member_router.delete("/vote/:userId/:requestId", voteC.resetVote); // Works

export default member_router;