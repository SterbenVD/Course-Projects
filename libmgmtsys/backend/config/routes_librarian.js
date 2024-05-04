import { Router } from "express";
import * as middleware from "./middleware.js";
import * as requestC from "../controllers/request.js";
import * as fineC from "../controllers/fine.js";
import * as reserveC from "../controllers/reserve.js";
import * as issueC from "../controllers/issue.js";
import * as bookC from "../controllers/book.js";


const librarian_router = new Router();

// Librarian routes // Works
librarian_router.use(middleware.isLibrarian); // Works

// Books // Works
librarian_router.post("/book", bookC.createBook); // Works
librarian_router.put("/book/:id", bookC.updateBook); // Works
librarian_router.delete("/book/:id", bookC.deleteBook); // Works

// Requests // Works
librarian_router.get("/requests", requestC.getAllRequests); // Works
librarian_router.get("/request/:id", requestC.getRequestbyId); // Works
librarian_router.put("/request/:id", requestC.updateRequest); // Works
librarian_router.delete("/request/:id", requestC.deleteRequest); // Works

// Fines // Works
librarian_router.get("/fines", fineC.getAllFines); // Works
librarian_router.get("/fine/:id", fineC.getFinebyId); // Works
librarian_router.put("/fine/:id", fineC.updateFine); // Works
librarian_router.delete("/fine/:id", fineC.deleteFine); // Works

// Reserves // Works
librarian_router.get("/reserves", reserveC.getAllReserves); // Works
librarian_router.get("/reserve/:id", reserveC.getReservebyId); // Works
librarian_router.put("/reserve/:id", reserveC.updateReserve); // Works
librarian_router.delete("/reserve/:id", reserveC.deleteReserve); // Works
// Issues // Works
librarian_router.get("/issues", issueC.getAllIssues); // Works
librarian_router.get("/issue/:id", issueC.getIssuebyId); // Works
librarian_router.put("/issue/:id", issueC.updateIssue); // Works
librarian_router.delete("/issue/:id", issueC.deleteIssue); // Works



export default librarian_router;