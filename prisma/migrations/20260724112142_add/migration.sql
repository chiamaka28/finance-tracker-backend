/*
  Warnings:

  - A unique constraint covering the columns `[color]` on the table `Budgets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[color]` on the table `Pots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budgets_color_key" ON "Budgets"("color");

-- CreateIndex
CREATE UNIQUE INDEX "Pots_color_key" ON "Pots"("color");
