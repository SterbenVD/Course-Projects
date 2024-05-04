/*
  Warnings:

  - You are about to drop the column `vote_score` on the `Requests` table. All the data in the column will be lost.
  - Added the required column `deadline` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "request_name" TEXT NOT NULL,
    "request_status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Requests" ("createdAt", "id", "request_name", "request_status", "userId") SELECT "createdAt", "id", "request_name", "request_status", "userId" FROM "Requests";
DROP TABLE "Requests";
ALTER TABLE "new_Requests" RENAME TO "Requests";
CREATE TABLE "new_Issue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "issue_status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" DATETIME NOT NULL,
    CONSTRAINT "Issue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Issue_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Issue" ("bookId", "createdAt", "id", "issue_status", "userId") SELECT "bookId", "createdAt", "id", "issue_status", "userId" FROM "Issue";
DROP TABLE "Issue";
ALTER TABLE "new_Issue" RENAME TO "Issue";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
