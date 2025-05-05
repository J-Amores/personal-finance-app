/*
  Warnings:

  - You are about to alter the column `alerts` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

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
    "alerts" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Budget" ("alerts", "amount", "category", "createdAt", "endDate", "id", "isRecurring", "name", "notes", "period", "spent", "startDate", "updatedAt") SELECT "alerts", "amount", "category", "createdAt", "endDate", "id", "isRecurring", "name", "notes", "period", "spent", "startDate", "updatedAt" FROM "Budget";
DROP TABLE "Budget";
ALTER TABLE "new_Budget" RENAME TO "Budget";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
