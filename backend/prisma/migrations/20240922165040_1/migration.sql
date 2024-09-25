/*
  Warnings:

  - You are about to drop the column `scheduled_at` on the `Entry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "scheduled_at" DATETIME NOT NULL
);
INSERT INTO "new_Entry" ("scheduled_at", "created_at", "description", "id", "title") SELECT "scheduled_at","created_at", "description", "id", "title" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
