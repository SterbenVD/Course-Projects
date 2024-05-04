import { Router } from "express";
import * as authC from "../controllers/auth.js";
import * as userC from "../controllers/user.js";
import * as bookC from "../controllers/book.js";
import * as voteC from "../controllers/vote.js";
import * as fineC from "../controllers/fine.js";
import * as requestC from "../controllers/request.js";
import * as reserveC from "../controllers/reserve.js";
import * as issueC from "../controllers/issue.js";

import admin_router from "./routes_admin.js";
import librarian_router from "./routes_librarian.js";
import member_router from "./routes_member.js";

const router = new Router();

router.post("/login", authC.login);
router.post("/checkToken", authC.checkToken);

router.get("/user/:id", userC.getUserbyId); // Works
router.get("/book/:id", bookC.getBookById); // Works
router.get("/request/:id", requestC.getRequestbyId); // Works
router.get("/fine/:id", fineC.getFinebyId); // Works
router.get("/reserve/:id", reserveC.getReservebyId); // Works
router.get("/issue/:id", issueC.getIssuebyId); // Works
router.get("/vote/:id", voteC.getVoteCount); // Works
router.get("/search/:query", bookC.getBookByQuery); // Works
router.get("/requests", requestC.getAllRequests); // Works


// MemberType specific routes are in their respective files
// Admin routes
router.use(admin_router);
// Librarian routes
router.use(librarian_router);
// Member routes
router.use(member_router);

export default router;