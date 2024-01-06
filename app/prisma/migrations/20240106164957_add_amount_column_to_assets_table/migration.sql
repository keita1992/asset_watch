/*
  Warnings:

  - Added the required column `amount` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assets` ADD COLUMN `amount` INTEGER NOT NULL;
