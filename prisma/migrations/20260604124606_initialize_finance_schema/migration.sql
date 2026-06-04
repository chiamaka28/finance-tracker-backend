-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ENTERTAINMENT', 'BILLS', 'GROCERIES', 'DINING_OUT', 'TRANSPORTATION', 'PERSONAL_CARE', 'EDUCATION', 'LIFESTYLE', 'SHOPPING', 'GENERAL');

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "avatarUrl" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pots" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "target" DECIMAL(12,2) NOT NULL,
    "color" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Pots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budgets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maxAmount" DECIMAL(12,2) NOT NULL,
    "color" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "dueDate" INTEGER NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Bills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Budgets_userId_category_key" ON "Budgets"("userId", "category");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pots" ADD CONSTRAINT "Pots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budgets" ADD CONSTRAINT "Budgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bills" ADD CONSTRAINT "Bills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
