/*
  Warnings:

  - You are about to drop the column `theme` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `alerts` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Budget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "spent" REAL NOT NULL DEFAULT 0,
    "period" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "notes" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "alerts" TEXT NOT NULL, -- SQLite doesn't have JSONB, store as TEXT
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Budget" (
  "id", "name", "category", "amount", "spent", "period", 
  "startDate", "endDate", "notes", "isRecurring", "alerts", 
  "createdAt", "updatedAt"
) 
SELECT 
  "id", 
  "category" as "name", 
  "category", 
  "amount", 
  "spent", 
  "period",
  date('now') as "startDate",
  NULL as "endDate",
  NULL as "notes",
  true as "isRecurring",
  json('{"enabled": false}') as "alerts",
  "createdAt",
  "updatedAt"
FROM "Budget";
DROP TABLE "Budget";
ALTER TABLE "new_Budget" RENAME TO "Budget";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
