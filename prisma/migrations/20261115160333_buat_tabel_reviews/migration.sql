-- CreateTable
CREATE TABLE `product_reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reviewer` VARCHAR(100) NOT NULL,
    `comment` TEXT NOT NULL,
    `rating` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
