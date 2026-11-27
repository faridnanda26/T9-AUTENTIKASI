-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_productId_fkey`;

-- DropIndex
DROP INDEX `orders_productId_fkey` ON `orders`;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
