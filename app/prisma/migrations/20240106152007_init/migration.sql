-- CreateTable
CREATE TABLE `assets` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `currency` VARCHAR(16) NOT NULL,
    `category` VARCHAR(16) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `modified_at` DATETIME(0) NOT NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
