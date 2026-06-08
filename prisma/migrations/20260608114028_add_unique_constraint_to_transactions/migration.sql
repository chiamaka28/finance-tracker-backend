/*
  Warnings:

  - A unique constraint covering the columns `[name,date,userId]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transactions_name_date_userId_key" ON "Transactions"("name", "date", "userId");
