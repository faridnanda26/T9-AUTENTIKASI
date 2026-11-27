/*
  Warnings:

  - You are about to alter the column `category` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `category` ENUM('MAKANAN', 'MINUMAN', 'CEMILAN') NOT NULL;
